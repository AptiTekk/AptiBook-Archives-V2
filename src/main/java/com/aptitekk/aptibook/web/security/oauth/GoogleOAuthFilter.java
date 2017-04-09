/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.oauth;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import com.aptitekk.aptibook.core.services.auth.GoogleOAuthService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class GoogleOAuthFilter extends OncePerRequestFilter {

    private static final String AUTH_URL = "/api/oauth/google";
    private static final String CALLBACK_URL = "/api/oauth/google/callback";

    private final TenantManagementService tenantManagementService;
    private final PropertiesRepository propertiesRepository;
    private final GoogleOAuthService googleOAuthService;

    @Autowired
    public GoogleOAuthFilter(TenantManagementService tenantManagementService,
                             PropertiesRepository propertiesRepository,
                             GoogleOAuthService googleOAuthService) {

        this.tenantManagementService = tenantManagementService;
        this.propertiesRepository = propertiesRepository;
        this.googleOAuthService = googleOAuthService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if (request.getRequestURI().startsWith(CALLBACK_URL)) {
            //TODO: Google OAuth Callback
            return;
        } else if (request.getRequestURI().startsWith(AUTH_URL)) {
            Property googleSignInProperty = propertiesRepository.findPropertyByKey(Property.Key.GOOGLE_SIGN_IN_ENABLED);
            if (Boolean.parseBoolean(googleSignInProperty.propertyValue)) {
                String signInUrl = googleOAuthService.getSignInUrl(tenantManagementService.getTenant());
                if (signInUrl != null) {
                    response.setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
                    response.setHeader("Location", signInUrl);
                    return;
                }
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }
            response.setStatus(HttpServletResponse.SC_NOT_IMPLEMENTED);
            return;
        }

        filterChain.doFilter(request, response);
    }

}
