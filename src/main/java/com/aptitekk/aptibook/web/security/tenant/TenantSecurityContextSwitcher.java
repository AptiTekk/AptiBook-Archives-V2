/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.tenant;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;

/**
 * This class wraps around the default {@link org.springframework.security.web.context.HttpSessionSecurityContextRepository}
 * and exposes/hides SecurityContexts in the request session attributes depending on the Tenant.
 */
@Component
public class TenantSecurityContextSwitcher extends OncePerRequestFilter {

    /**
     * A HttpSession attribute key that contains the {@link TenantMap} which the Authentications are stored in.
     */
    private static final String TENANT_SECURITY_AUTHENTICATIONS_ATTRIBUTE = "TENANT_SECURITY_AUTHENTICATIONS";

    private final TenantManagementService tenantManagementService;

    @Autowired
    public TenantSecurityContextSwitcher(TenantManagementService tenantManagementService) {
        this.tenantManagementService = tenantManagementService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Tenant currentTenant = tenantManagementService.getTenant();

        // Load a context into the HttpSessionSecurityContextRepository attribute, if needed.
        this.loadContextIntoSession(request);

        filterChain.doFilter(request, response);

        // Save the context from the HttpSessionSecurityContextRepository attribute into our map.

    }

    /**
     * Depending on the current Tenant, loads a SecurityContext into the session attribute used by the
     * {@link org.springframework.security.web.context.SecurityContextPersistenceFilter}
     *
     * @param request The current request.
     */
    private void loadContextIntoSession(HttpServletRequest request) {
        // Get the Tenant associated with this request, if there is one.
        Tenant currentTenant = tenantManagementService.getTenant();

        // Get the request's session, if there is one.
        HttpSession session = request.getSession(false);
        if (session != null) {

            // Get the attribute containing the TenantMap.
            Object tenantSecurityAuthenticationsAttribute = session.getAttribute(TENANT_SECURITY_AUTHENTICATIONS_ATTRIBUTE);
            if (tenantSecurityAuthenticationsAttribute instanceof TenantMap) {

                // Get the Authentication object mapped to this Tenant.
                Authentication authenticationForTenant = ((TenantMap) tenantSecurityAuthenticationsAttribute).get(currentTenant != null ? currentTenant.id : null);

                // Create a SecurityContext to hold the Authentication.
                SecurityContext newContext = SecurityContextHolder.createEmptyContext();

                // Assign the Authentication to the SecurityContext
                newContext.setAuthentication(authenticationForTenant);

                // Update the attribute used by SecurityContextPersistenceFilter with the new SecurityContext.
                session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, newContext);
            }
        }
    }

    /**
     * Saves and maps the SecurityContext used by the {@link org.springframework.security.web.context.SecurityContextPersistenceFilter}
     * to this filter's session attribute, depending on the current Tenant.
     *
     * @param request The current request.
     */
    private void saveContextFromSession(HttpServletRequest request) {
        // Get the Tenant associated with this request, if there is one.
        Tenant currentTenant = tenantManagementService.getTenant();

        // Get the request's session, if there is one.
        HttpSession session = request.getSession(false);
        if (session != null) {

            // Get the attribute containing the TenantMap.
            Object tenantSecurityAuthenticationsAttribute = session.getAttribute(TENANT_SECURITY_AUTHENTICATIONS_ATTRIBUTE);
            TenantMap tenantMap;

            // Check if the TenantMap exists already.
            if (tenantSecurityAuthenticationsAttribute instanceof TenantMap) {
                // It does exist.
                tenantMap = (TenantMap) tenantSecurityAuthenticationsAttribute;
            } else {
                // It does not exist; create a new TenantMap for this session.
                tenantMap = new TenantMap();
                session.setAttribute(TENANT_SECURITY_AUTHENTICATIONS_ATTRIBUTE, tenantMap);
            }

            // Get the attribute containing the SecurityContext used by SecurityContextPersistenceFilter
            Object securityContextAttribute = session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);

            // Check that a SecurityContext is saved.
            if (securityContextAttribute instanceof SecurityContext) {
                // It is saved; map the SecurityContext to the current Tenant.
                tenantMap.put(currentTenant != null ? currentTenant.id : null, ((SecurityContext) securityContextAttribute).getAuthentication());
            } else {
                // It is not saved; Remove any mapped SecurityContext for the current Tenant.
                tenantMap.remove(currentTenant != null ? currentTenant.id : null);
            }
        }
    }

    /**
     * Maps Tenant IDs to Authentication instances.
     */
    private static class TenantMap extends HashMap<Long, Authentication> {
        /**
         * Most users will only access one Tenant per session, so this constructor sets the
         * initial capacity to 1.
         */
        private TenantMap() {
            super(1);
        }
    }

}
