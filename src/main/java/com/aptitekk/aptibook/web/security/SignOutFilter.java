/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.enums.property.AuthenticationMethod;
import com.aptitekk.aptibook.core.domain.entities.enums.property.Property;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.aptitekk.aptibook.web.security.cas.CASCallbackFilter;
import com.aptitekk.aptibook.web.util.WebURIBuilderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;

@Component
public class SignOutFilter extends OncePerRequestFilter {

    private final static String SIGN_OUT_PATH = "/api/sign-out";
    private final TenantManagementService tenantManagementService;
    private final WebURIBuilderService webURIBuilderService;

    @Autowired
    public SignOutFilter(TenantManagementService tenantManagementService,
                         WebURIBuilderService webURIBuilderService) {
        this.tenantManagementService = tenantManagementService;
        this.webURIBuilderService = webURIBuilderService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Check for sign out in path.
        if (request.getRequestURI().startsWith(SIGN_OUT_PATH)) {

            // Make sure we're on a Tenant
            Tenant currentTenant = this.tenantManagementService.getTenant();
            if (currentTenant != null) {
                // Clear the security context.
                SecurityContextHolder.clearContext();

                // Check if CAS is enabled.
                String authenticationMethod = currentTenant.properties.get(Property.Key.AUTHENTICATION_METHOD);
                if (authenticationMethod != null && AuthenticationMethod.valueOf(authenticationMethod).equals(AuthenticationMethod.CAS)) {
                    // Redirect to the CAS logout page.
                    String casServiceUrl = currentTenant.properties.get(Property.Key.CAS_SERVER_URL);
                    response.sendRedirect(casServiceUrl + "/logout?service=" + URLEncoder.encode(webURIBuilderService.buildURI(CASCallbackFilter.CALLBACK_PATH, null).toString(), "UTF-8"));
                    return;
                }
            }

            // If using built in authentication or there's no Tenant, just go to the root.
            response.sendRedirect("/");
            return;
        }

        filterChain.doFilter(request, response);
    }

}
