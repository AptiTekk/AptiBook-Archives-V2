/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.cas;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.enums.property.AuthenticationMethod;
import com.aptitekk.aptibook.core.domain.entities.enums.property.Property;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.RegistrationService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.aptitekk.aptibook.web.security.UserIDAuthenticationToken;
import com.google.common.base.Charsets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;
import org.yaml.snakeyaml.util.UriEncoder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.net.URLEncoder;

@Component
public class CASCallbackFilter extends OncePerRequestFilter {

    public final static String CALLBACK_PATH = "/api/cas/callback";

    private final TenantManagementService tenantManagementService;
    private final RegistrationService registrationService;
    private final UserRepository userRepository;
    private final LogService logService;

    @Autowired
    public CASCallbackFilter(TenantManagementService tenantManagementService,
                             RegistrationService registrationService,
                             UserRepository userRepository,
                             LogService logService) {
        this.tenantManagementService = tenantManagementService;
        this.registrationService = registrationService;
        this.userRepository = userRepository;
        this.logService = logService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Check for CAS Service Callback Request
        if (request.getRequestURI().startsWith(CALLBACK_PATH)) {
            try {
                Tenant currentTenant = tenantManagementService.getTenant();
                // Make sure we are accessing from a Tenant.
                if (currentTenant == null)
                    throw new CASCallbackException("The CAS Callback must be accessed from a Tenant.");

                // Check that CAS is enabled.
                String authenticationMethod = currentTenant.properties.get(Property.Key.AUTHENTICATION_METHOD);
                if (authenticationMethod == null || AuthenticationMethod.valueOf(authenticationMethod) != AuthenticationMethod.CAS) {
                    this.redirectBackToSignIn(response, "CAS Authentication is not enabled.");
                    return;
                }

                // Check for a valid CAS Server Url
                String casUrl = currentTenant.properties.get(Property.Key.CAS_SERVER_URL);
                if (casUrl == null || casUrl.isEmpty()) {
                    this.redirectBackToSignIn(response, "CAS Authentication is not properly configured.");
                    return;
                }

                // Check for a Ticket
                String ticketParam = request.getParameter("ticket");
                if (ticketParam == null)
                    throw new CASCallbackException("No ticket was supplied.");

                // Validate the ticket and get the CAS User ID.
                String casUserId = getCASUserIdFromTicket(request, casUrl, ticketParam);

                // Look for an existing user with this ID.
                User user = this.userRepository.findByCASID(casUserId);

                if (user != null) {
                    // User was found, sign them in.
                    SecurityContextHolder.getContext().setAuthentication(new UserIDAuthenticationToken(user.getId()));

                    // Redirect back to root.
                    response.sendRedirect("/");
                    return;
                } else {
                    // Create the CAS User and begin registration.
                    user = new User();
                    user.setCasId(casUserId);

                    // This method will call a redirect.
                    this.registrationService.beginRegistration(user, request, response);
                    return;
                }
            } catch (CASCallbackException e) {
                this.redirectBackToSignIn(response, e.getMessage());
                this.logService.logException(getClass(), e, "Something went wrong during a CAS Callback Request");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Validates the ticket with the CAS server, and returns the CAS User ID obtained.
     *
     * @param request The request made.
     * @param casUrl  The URL of the CAS server.
     * @param ticket  The ticket received.
     * @return The CAS User ID.
     * @throws CASTicketValidationException If the ticket could not be validated.
     */
    private static String getCASUserIdFromTicket(HttpServletRequest request, String casUrl, String ticket) throws CASTicketValidationException {
        try {
            Document casDocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(casUrl + "/serviceValidate?ticket=" + ticket + "&service=" + URLEncoder.encode(request.getRequestURL().toString(), "UTF-8"));
            casDocument.normalize();

            Element documentElement = casDocument.getDocumentElement();
            if (documentElement.getTagName().equals("cas:serviceResponse")) {
                Element authenticationSuccessElement = (Element) documentElement.getElementsByTagName("cas:authenticationSuccess").item(0);
                if (authenticationSuccessElement != null) {
                    Element userElement = (Element) authenticationSuccessElement.getElementsByTagName("cas:user").item(0);
                    if (userElement != null) {
                        return userElement.getTextContent();
                    } else {
                        throw new CASTicketValidationException("Authentication was Successful, but a User ID was not found.");
                    }
                } else {
                    Element authenticationFailureElement = (Element) documentElement.getElementsByTagName("cas:authenticationFailure").item(0);
                    if (authenticationFailureElement != null) {
                        throw new CASTicketValidationException("Authentication Failure.");
                    }
                }
            }

            throw new CASTicketValidationException("Invalid XML Response");
        } catch (SAXException | ParserConfigurationException | IOException e) {
            throw new CASTicketValidationException("Could not parse service validation request as XML.", e);
        }
    }

    /**
     * Redirects the request back to the sign in page, if possible.
     *
     * @param response The response.
     * @param message  An optional message to write to the response headers.
     * @throws IOException If writing to the response fails.
     */
    private void redirectBackToSignIn(HttpServletResponse response, String message) throws IOException {
        // Write message to header
        if (message != null)
            response.setHeader("X-CAS-Error-Message", message);

        Tenant currentTenant = tenantManagementService.getTenant();
        if (currentTenant == null) {
            // Not sure where they came from.
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("We apologize, but something wen't wrong while logging in. We have been notified of the problem.");
            response.getWriter().println("We are not sure where you came from, so you must return to the sign in page through your browser's address bar.");
            response.getWriter().println("Thank you for your understanding!");
        } else {
            // Redirect to root of domain, which should be the sign in page.
            response.sendRedirect("/");
        }
    }

    /**
     * Thrown when something happens while processing the ticket in the callback.
     */
    private static class CASCallbackException extends RuntimeException {
        CASCallbackException() {
            super();
        }

        CASCallbackException(String message) {
            super(message);
        }

        CASCallbackException(String message, Throwable cause) {
            super(message, cause);
        }

        CASCallbackException(Throwable cause) {
            super(cause);
        }

        CASCallbackException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
            super(message, cause, enableSuppression, writableStackTrace);
        }
    }

    /**
     * Thrown when the ticket cannot be validated with the CAS server during callback.
     */
    private static class CASTicketValidationException extends CASCallbackException {
        CASTicketValidationException() {
            super();
        }

        CASTicketValidationException(String message) {
            super(message);
        }

        CASTicketValidationException(String message, Throwable cause) {
            super(message, cause);
        }

        CASTicketValidationException(Throwable cause) {
            super(cause);
        }

        CASTicketValidationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
            super(message, cause, enableSuppression, writableStackTrace);
        }
    }

}
