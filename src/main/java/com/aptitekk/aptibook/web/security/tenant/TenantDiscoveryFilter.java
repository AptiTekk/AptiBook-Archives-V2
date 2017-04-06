/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.tenant;

import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Extracts the tenant slug from the url (if applicable) and stores the tenant in the request for later use.
 */
@Component
public class TenantDiscoveryFilter extends OncePerRequestFilter {

    public static final String TENANT_ATTRIBUTE = "tenant";

    private final TenantManagementService tenantManagementService;

    @Autowired
    public TenantDiscoveryFilter(TenantManagementService tenantManagementService) {
        this.tenantManagementService = tenantManagementService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String[] path = httpServletRequest.getRequestURI().substring(1).split("/");

        // "/api/tenant/endpoint" -> ["api", "tenant", "endpoint"] -> length 3
        if (path.length >= 2) {
            if (path[0].equalsIgnoreCase("api")) {
                String tenantSlug = path[1].toLowerCase();

                // Ensure the slug is allowed
                if (tenantManagementService.getAllowedTenantSlugs().contains(tenantSlug))
                    // Store the tenant for use elsewhere in the application.
                    request.setAttribute(TENANT_ATTRIBUTE, tenantManagementService.getTenantBySlug(tenantSlug));
            }
        }

        filterChain.doFilter(request, response);
    }

}
