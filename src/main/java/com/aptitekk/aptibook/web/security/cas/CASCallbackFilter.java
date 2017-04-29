/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.cas;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CASCallbackFilter extends OncePerRequestFilter {

    private final String CALLBACK_PATH = "/api/cas/callback";

    private final TenantManagementService tenantManagementService;
    private final LogService logService;

    @Autowired
    public CASCallbackFilter(TenantManagementService tenantManagementService,
                             LogService logService) {
        this.tenantManagementService = tenantManagementService;
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

                // Check for a Ticket
                String ticketParam = request.getParameter("ticket");
                if (ticketParam == null)
                    throw new CASCallbackException("No ticket was supplied.");

                // Validate the ticket and get the CAS User ID.
                String casUserId = getCASUserIdFromTicket(request, currentTenant, ticketParam);

                System.out.println("CAS Callback Received:");
                System.out.println(casUserId);
                return;
            } catch (CASCallbackException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("We apologize, but something wen't wrong while logging in. We have been notified of the problem.");
                response.getWriter().println("We are not sure where you came from, so you must return to the sign in page through your browser's address bar.");
                response.getWriter().println("Thank you for your understanding!");
                this.logService.logException(getClass(), e, "Something went wrong during a CAS Callback Request");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Validates the ticket with the CAS server, and returns the CAS User ID obtained.
     *
     * @param request       The request made.
     * @param currentTenant The current Tenant.
     * @param ticket        The ticket received.
     * @return The CAS User ID.
     * @throws CASTicketValidationException If the ticket could not be validated.
     */
    private static String getCASUserIdFromTicket(HttpServletRequest request, Tenant currentTenant, String ticket) throws CASTicketValidationException {
        RestTemplate restTemplate = new RestTemplate();
        //FIXME: Don't hardcode the CAS URL
        String casUrl = "https://dev.aptitekk.com/cas";
        try {
            ResponseEntity<String> responseEntity = restTemplate.getForEntity(casUrl + "/serviceValidate?ticket=" + ticket + "&service=" + request.getRequestURL().toString() + "&format=JSON", String.class);

            // Check for OK status
            if (responseEntity.getStatusCode() != HttpStatus.OK)
                throw new CASTicketValidationException("Status was " + responseEntity.getStatusCode() + ". Body: " + responseEntity.getBody());

            try {
                // Convert response body to JSON
                JSONObject body = new JSONObject(responseEntity.getBody());
                // Check for serviceResponse key.
                JSONObject serviceResponse = body.getJSONObject("serviceResponse");
                // Check for authenticationSuccess key.
                JSONObject authenticationSuccess = serviceResponse.getJSONObject("authenticationSuccess");
                // Get and return User
                return authenticationSuccess.getString("user");
            } catch (JSONException e) {
                throw new CASTicketValidationException("Invalid JSON Format or Authentication Failure.", e);
            }
        } catch (RestClientException e) {
            throw new CASTicketValidationException("Could not send GET request to CAS service.", e);
        }
    }

    /**
     * Thrown when something happens while processing the ticket in the callback.
     */
    private static class CASCallbackException extends RuntimeException {
        public CASCallbackException() {
            super();
        }

        public CASCallbackException(String message) {
            super(message);
        }

        public CASCallbackException(String message, Throwable cause) {
            super(message, cause);
        }

        public CASCallbackException(Throwable cause) {
            super(cause);
        }

        protected CASCallbackException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
            super(message, cause, enableSuppression, writableStackTrace);
        }
    }

    /**
     * Thrown when the ticket cannot be validated with the CAS server during callback.
     */
    private static class CASTicketValidationException extends CASCallbackException {
        public CASTicketValidationException() {
            super();
        }

        public CASTicketValidationException(String message) {
            super(message);
        }

        public CASTicketValidationException(String message, Throwable cause) {
            super(message, cause);
        }

        public CASTicketValidationException(Throwable cause) {
            super(cause);
        }

        protected CASTicketValidationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
            super(message, cause, enableSuppression, writableStackTrace);
        }
    }

}
