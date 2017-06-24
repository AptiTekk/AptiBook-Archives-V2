/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.domain.entities.Tenant;
import com.aptitekk.aptibook.domain.entities.User;
import com.aptitekk.aptibook.domain.entities.property.Property;
import com.aptitekk.aptibook.domain.repositories.UserRepository;
import com.aptitekk.aptibook.service.tenant.TenantManagementService;
import com.aptitekk.aptibook.web.security.cas.CASCallbackFilter;
import com.aptitekk.aptibook.web.util.WebURIBuilderService;
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
import java.net.URLEncoder;

@Component
public class SignOutFilter extends OncePerRequestFilter {

    private final static String SIGN_OUT_PATH = "/web/sign-out";
    private final TenantManagementService tenantManagementService;
    private final WebURIBuilderService webURIBuilderService;
    private final UserRepository userRepository;

    @Autowired
    public SignOutFilter(TenantManagementService tenantManagementService,
                         WebURIBuilderService webURIBuilderService,
                         UserRepository userRepository) {
        this.tenantManagementService = tenantManagementService;
        this.webURIBuilderService = webURIBuilderService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Check for sign out in path.
        if (request.getRequestURI().startsWith(SIGN_OUT_PATH)) {

            // Make sure we're on a Tenant
            Tenant currentTenant = this.tenantManagementService.getTenant();
            if (currentTenant != null) {

                // Check if there is a currently signed in user.
                User currentUser = null;
                Authentication currentAuthentication = SecurityContextHolder.getContext().getAuthentication();
                if(currentAuthentication != null && currentAuthentication instanceof UserIDAuthenticationToken) {
                    currentUser = userRepository.findInCurrentTenant(((UserIDAuthenticationToken) currentAuthentication).getUserId());
                }

                // Clear the security context.
                SecurityContextHolder.clearContext();

                // If the current user is an admin, then we just want to go to the admin sign in page.
                if(currentUser != null && currentUser.isAdmin()) {
                    response.sendRedirect("/sign-in/admin");
                    return;
                }

                // Check if CAS is enabled.
                String authenticationMethod = currentTenant.getProperties().get(Property.AUTHENTICATION_METHOD);
                if (authenticationMethod != null && Property.AuthenticationMethod.valueOf(authenticationMethod).equals(Property.AuthenticationMethod.CAS)) {
                    // Redirect to the CAS logout page.
                    String casServiceUrl = currentTenant.getProperties().get(Property.CAS_SERVER_URL);
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
