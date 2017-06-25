/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.tenant;

import com.aptitekk.aptibook.service.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Extracts the tenant domain from the url (if applicable) and stores the tenant in the request for later use.
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
        String[] serverNameParts = request.getServerName().split("\\.");

        // "demo.aptibook.net" -> ["demo", "aptibook", "net"]
        String tenantDomain = serverNameParts[0].toLowerCase();

        // Ensure the domain is allowed
        if (tenantManagementService.getAllowedTenantDomains().contains(tenantDomain))
            // Store the Tenant ID for use elsewhere in the application.
            request.setAttribute(TENANT_ATTRIBUTE, tenantManagementService.getTenantByDomain(tenantDomain).getId());

        filterChain.doFilter(request, response);
    }

}
