/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.oauth;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.SpringProfileService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.aptitekk.aptibook.web.security.UserIDAuthenticationToken;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.oauth.OAuth20Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
abstract class AbstractOAuthFilter extends OncePerRequestFilter {

    private static final Map<String, String> SESSION_ORIGIN_MAP = new ConcurrentHashMap<>();

    private final String urlGenerationPath;
    private final String callbackPath;

    private final String name;
    private final Property.Key propertyKey;
    protected final String apiKey;
    protected final String apiSecret;

    @Autowired
    private TenantManagementService tenantManagementService;

    @Autowired
    private SpringProfileService springProfileService;

    @Autowired
    private PropertiesRepository propertiesRepository;

    @Autowired
    private LogService logService;

    AbstractOAuthFilter(String name, Property.Key propertyKey, String apiKey, String apiSecret) {
        this.name = name;
        this.propertyKey = propertyKey;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;

        if (!name.matches("^[a-z]+$"))
            throw new IllegalArgumentException("The name must contain only lowercase letters.");

        this.urlGenerationPath = "/api/oauth/" + name;
        this.callbackPath = urlGenerationPath + "/callback";
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Check for OAuth Callback Request
        if (request.getRequestURI().startsWith(callbackPath)) {
            // Callback Request
            try {
                // Check if we are accessing from a Tenant (which we redirected to), or if this is the callback from the OAuth Provider.
                Tenant currentTenant = tenantManagementService.getTenant();
                if (currentTenant == null) {
                    // This probably came from the OAuth Provider. Let's make sure that all the right parameters came through.
                    String stateParam = request.getParameter("state");
                    String codeParam = request.getParameter("code");
                    if (stateParam == null || codeParam == null) {
                        // One of the parameters are missing... This shouldn't happen!
                        throw new OAuthCallbackException("The state and/or code parameters were missing! Parameters: State: " + stateParam + " - Code: " + codeParam);
                    }

                    // Get the place that the user came from in the beginning.
                    String origin = SESSION_ORIGIN_MAP.get(stateParam);
                    if (origin == null) {
                        // The origin shouldn't be null.
                        throw new OAuthCallbackException("The origin could not be found! State: " + stateParam + " - Origin Map: " + SESSION_ORIGIN_MAP);
                    }

                    // Free up some memory from the map.
                    SESSION_ORIGIN_MAP.remove(stateParam);

                    // Redirect to the callback at the user's origin.
                    response.sendRedirect(origin + callbackPath + "?code=" + codeParam);
                    return;
                } else {
                    // This came from the callback redirection performed in the code above.
                    String codeParam = request.getParameter("code");
                    if (codeParam == null) {
                        // The code is missing... This shouldn't happen!
                        redirectWithError(response, "missing_code");
                        return;
                    }

                    try {
                        // Get the User from the code
                        User user = this.getUserFromOAuthCode(buildOAuthService(createServiceBuilder(request)), codeParam);

                        // Authenticate the User.
                        SecurityContextHolder.getContext().setAuthentication(new UserIDAuthenticationToken(user.getId()));

                        // Send back to Sign In page.
                        response.sendRedirect("/sign-in");
                        return;
                    } catch (EmailDomainNotAllowedException e) {
                        // The Email domain used is not allowed.
                        redirectWithError(response, "invalid_domain");
                        return;
                    }
                }
            } catch (OAuthCallbackException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("We apologize, but something wen't wrong while logging in. We have been notified of the problem.");
                response.getWriter().println("We are not sure where you came from, so you must return to the sign in page through your browser's address bar.");
                response.getWriter().println("Thank you for your understanding!");
                this.logService.logException(getClass(), e, "Something went wrong during an OAuth Callback Request");
                return;
            }
        } else if (request.getRequestURI().startsWith(urlGenerationPath)) {
            // URL Generation Request

            // Make sure that we are accessing from a Tenant.
            Tenant currentTenant = tenantManagementService.getTenant();
            if (currentTenant != null) {

                // Check if the OAuth Property is Enabled.
                Property oAuthProperty = propertiesRepository.findPropertyByKey(propertyKey);
                if (Boolean.parseBoolean(oAuthProperty.propertyValue)) {
                    // OAuth is Enabled.

                    // Build the Service
                    OAuth20Service oAuth20Service = this.buildOAuthService(createServiceBuilder(request));

                    // Generate a Sign-In URL to redirect to.
                    String oAuthProviderUrl = generateUrl(oAuth20Service, request);

                    // Check that the URL was generated correctly.
                    if (oAuthProviderUrl != null) {

                        // Send a redirect to the generated URL.
                        response.sendRedirect(oAuthProviderUrl);
                        return;
                    }

                    // Something went wrong while generating the URL.
                    redirectWithError(response, "cannot_generate");
                    return;
                }

                // OAuth is Disabled.
                response.setStatus(HttpServletResponse.SC_NOT_IMPLEMENTED);
                response.getWriter().write("This authentication scheme is not enabled.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Redirects to the sign in page with the specified error name.
     *
     * @param errorName The name of the error, used in the parameters. Example: "cannot_generate"
     */
    private void redirectWithError(HttpServletResponse response, String errorName) throws IOException {
        response.sendRedirect("/sign-in?oauth_error=" + errorName + "&oauth_method=" + name);
    }

    /**
     * Used to generate a redirect URL for a client who is asking to Sign In with OAuth.
     *
     * @param request The current Request.
     * @return A generated OAuth URL that can be redirected to.
     */
    abstract String generateUrl(OAuth20Service oAuth20Service, HttpServletRequest request);

    /**
     * Creates a ServiceBuilder for the OAuth Request, and populates its API Key, API Secret, Callback, and State attributes.
     * Additionally, stores the CSRF Token from the state into the SESSION_ORIGIN_MAP.
     *
     * @param request The current Request.
     * @return A pre-filled ServiceBuilder.
     */
    private ServiceBuilder createServiceBuilder(HttpServletRequest request) {
        ServiceBuilder serviceBuilder = new ServiceBuilder();
        serviceBuilder.apiKey(apiKey);
        serviceBuilder.apiSecret(apiSecret);

        /* The baseUrl is where the callback should be sent. Most OAuth Providers don't allow
        for wildcards, so we need to pick a global callback location. */

        // For development purposes, we use localhost.
        String baseUrl = "http://localhost:8080";

        // For production, we use aptibook.net.
        if (springProfileService.isProfileActive(SpringProfileService.Profile.PRODUCTION)) {
            baseUrl = "https://aptibook.net";
        }

        serviceBuilder.callback(baseUrl + callbackPath);

        /* The state will be assigned the current CSRF token.
        We will store this token in the map, along with the scheme, name, and port of the origin server that the
        user came from when making this request. */
        serviceBuilder.state(getCSRFToken(request));
        SESSION_ORIGIN_MAP.put(getCSRFToken(request), request.getScheme() + "://" + request.getServerName() + (request.getServerPort() != 80 ? ":" + request.getServerPort() : ""));

        return serviceBuilder;
    }

    /**
     * Gets the CSRF Token for the current Request.
     *
     * @param request The current Request.
     * @return The CSRF Token, or null if one does not exist.
     */
    private String getCSRFToken(HttpServletRequest request) {
        // Get the CSRF Token that was generated
        CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());

        if (csrf == null || csrf.getToken() == null)
            return null;

        return csrf.getToken();
    }

    /**
     * Builds an {@link OAuth20Service} instance from the provided, pre-filled {@link ServiceBuilder}.
     * The provided ServiceBuilder is already populated with the API Key, API Secret, Callback, and State attributes.
     *
     * @param serviceBuilder The pre-filled ServiceBuilder.
     * @return An OAuth20Service instance.
     */
    abstract OAuth20Service buildOAuthService(ServiceBuilder serviceBuilder);

    /**
     * Retrieves an existing or new User from the OAuth Code.
     *
     * @param oAuthService The service used for retrieving details.
     * @param code         The code used for getting details from the OAuth Provider.
     * @return The existing or new User. (New Users should be inserted into the database before returning.)
     * @throws EmailDomainNotAllowedException If the email domain for the user is not allowed.
     */
    abstract User getUserFromOAuthCode(OAuth20Service oAuthService, String code) throws EmailDomainNotAllowedException;

    /**
     * An exception to be thrown when something goes wrong during the OAuth Callback Request.
     */
    private static class OAuthCallbackException extends RuntimeException {
        public OAuthCallbackException() {
            super();
        }

        public OAuthCallbackException(String message) {
            super(message);
        }

        public OAuthCallbackException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    /**
     * An exception that should be thrown if the domain name of the email address that the User is signing in with
     * is not allowed.
     */
    static class EmailDomainNotAllowedException extends Exception {
        public EmailDomainNotAllowedException(String domainName) {
            super(domainName);
        }
    }

}
