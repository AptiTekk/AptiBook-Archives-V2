/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.cas;

import com.aptitekk.aptibook.domain.entities.Tenant;
import com.aptitekk.aptibook.domain.entities.property.Property;
import com.aptitekk.aptibook.service.LogService;
import com.aptitekk.aptibook.service.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CASEntryFilter extends OncePerRequestFilter {

    private final static String ENTRY_PATH = "/web/cas/entry";

    private final TenantManagementService tenantManagementService;
    private final LogService logService;

    @Autowired
    public CASEntryFilter(TenantManagementService tenantManagementService,
                          LogService logService) {
        this.tenantManagementService = tenantManagementService;
        this.logService = logService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Check for CAS Service Callback Request
        if (request.getRequestURI().startsWith(ENTRY_PATH)) {
            try {
                Tenant currentTenant = tenantManagementService.getTenant();
                // Make sure we are accessing from a Tenant.
                if (currentTenant == null)
                    throw new CASEntryException("The CAS Entry must be accessed from a Tenant.");

                // Check that CAS is enabled.
                String authenticationMethod = currentTenant.getProperties().get(Property.AUTHENTICATION_METHOD);
                if (authenticationMethod == null || Property.AuthenticationMethod.valueOf(authenticationMethod) != Property.AuthenticationMethod.CAS) {
                    this.redirectBackToSignIn(response, "CAS Authentication is not enabled.");
                    return;
                }

                // Check for a valid CAS Server Url
                String casUrl = currentTenant.getProperties().get(Property.CAS_SERVER_URL);
                if (casUrl == null || casUrl.isEmpty()) {
                    this.redirectBackToSignIn(response, "CAS Authentication is not properly configured.");
                    return;
                }

                String requestPath = request.getRequestURL().toString();

                response.sendRedirect(casUrl + "/login?service=" + requestPath.substring(0, requestPath.indexOf("cas/") + 4) + "callback");
                return;
            } catch (CASEntryException e) {
                this.redirectBackToSignIn(response, e.getMessage());
                this.logService.logException(getClass(), e, "Something went wrong during a CAS Entry Request");
                return;
            }
        }

        filterChain.doFilter(request, response);
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
     * Thrown when something happens while processing the entry request.
     */
    private static class CASEntryException extends RuntimeException {
        CASEntryException() {
            super();
        }

        CASEntryException(String message) {
            super(message);
        }

        CASEntryException(String message, Throwable cause) {
            super(message, cause);
        }

        CASEntryException(Throwable cause) {
            super(cause);
        }

        CASEntryException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
            super(message, cause, enableSuppression, writableStackTrace);
        }
    }
}
