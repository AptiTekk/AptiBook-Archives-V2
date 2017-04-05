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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * The purpose of this filter is to enable the ability for users to be signed into multiple Tenants at the same time.
 * <p>
 * This is achieved by setting the TenantMapAuthenticationToken's (which holds a map with keys of Tenants and values of
 * authenticated User's IDs) current tenant to the tenant found by {@link TenantDiscoveryFilter}. This is used internally
 * by the token to determine the result of calling the {@link TenantMapAuthenticationToken#isAuthenticated()} method. If
 * the current tenant does not have a mapped user, then the method returns false; otherwise, true.
 * <p>
 * For example, the token of a user who is signed into /api/tenant1/ might have a map with the contents: [tenant1 -> 123].
 * Then, when the user visits /api/tenant2/, there is no key in the map of "tenant2". So,  * isAuthenticated returns
 * false. This tells Spring that it needs to authenticate the token.
 * <p>
 * Spring will then use the TenantMapAuthenticationTokenProvider to try to authenticate the token. This provider does
 * nothing more than return the token. This ensures that the token stays within the session context and is not deleted.
 * Without a provider, Spring would delete the token.
 * <p>
 * Finally, the user will authenticate using any other form of authentication, and this will add the "tenant2" key (in
 * our exmaple) to the map, making the isAuthenticated method return true. Now, next time the user accesses /api/tenant2/,
 * the key will be found in the map, authenticated will be set to true, and the user is allowed access to the endpoints.
 */
@Component
public class TenantAuthenticationFilter extends OncePerRequestFilter {

    private final TenantManagementService tenantManagementService;

    @Autowired
    public TenantAuthenticationFilter(TenantManagementService tenantManagementService) {
        this.tenantManagementService = tenantManagementService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Get the current authentication from the context.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Make sure the authentication is of the right type.
        if (authentication instanceof TenantMapAuthenticationToken) {

            // Get the current Tenant for this request
            Tenant currentTenant = tenantManagementService.getTenant();

            // Make sure we are accessing a Tenant at all.
            if (currentTenant != null) {
                // Set the current Tenant for this request on the authentication.
                ((TenantMapAuthenticationToken) authentication).setCurrentTenant(currentTenant.id);
            }
        }

        filterChain.doFilter(request, response);
    }

}
