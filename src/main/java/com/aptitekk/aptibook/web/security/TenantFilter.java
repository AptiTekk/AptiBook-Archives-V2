/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Extracts the tenant slug from the url (if applicable) and stores the tenant in the request for later use.
 */
@Component
public class TenantFilter extends GenericFilterBean {

    private final TenantManagementService tenantManagementService;

    @Autowired
    public TenantFilter(TenantManagementService tenantManagementService) {
        this.tenantManagementService = tenantManagementService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String[] path = httpServletRequest.getRequestURI().substring(1).split("/");

        // "/api/tenant/endpoint" -> ["api", "tenant", "endpoint"] -> length 3
        if (path.length >= 2) {
            if (path[0].equalsIgnoreCase("api")) {
                String tenantSlug = path[1].toLowerCase();

                // Ensure the slug is allowed
                if (tenantManagementService.getAllowedTenantSlugs().contains(tenantSlug))
                    // Store the tenant for use elsewhere in the application.
                    request.setAttribute("tenant", tenantManagementService.getTenantBySlug(tenantSlug));
            }
        }

        chain.doFilter(request, response);
    }
}
