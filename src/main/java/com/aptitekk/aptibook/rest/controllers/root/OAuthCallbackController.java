/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.root;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.auth.AuthService;
import com.aptitekk.aptibook.core.services.auth.GoogleOAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class OAuthCallbackController {

    private final TenantRepository tenantRepository;
    private final GoogleOAuthService googleOAuthService;
    private final AuthService authService;
    private final LogService logService;

    @Autowired
    public OAuthCallbackController(TenantRepository tenantRepository, GoogleOAuthService googleOAuthService, AuthService authService, LogService logService) {
        this.tenantRepository = tenantRepository;
        this.googleOAuthService = googleOAuthService;
        this.authService = authService;
        this.logService = logService;
    }

    @RequestMapping("oauth/google")
    public void onOAuthCallback(HttpServletResponse httpServletResponse,
                                @RequestParam(value = "state", required = false) String state,
                                @RequestParam(value = "code", required = false) String code) {
        if (state != null && !state.isEmpty() && code != null && !code.isEmpty()) {
            String[] stateSplit = state.split("=");
            if (stateSplit.length == 2) {
                String tenantSlug = stateSplit[1];
                Tenant tenant = tenantRepository.findTenantBySlug(tenantSlug);
                if (tenant != null) {
                    User user = googleOAuthService.getUserFromCode(tenant, code);
                    if (user != null) {
                        authService.setUserOfTenant(user, tenant, httpServletResponse);
                    }
                }
                try {
                    httpServletResponse.sendRedirect("/" + tenantSlug + "/");
                    return;
                } catch (IOException e) {
                    logService.logException(getClass(), e, "Could not redirect to tenant root");
                }
            }
        }

        try {
            httpServletResponse.sendRedirect("/");
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not redirect to web root");
        }
    }

}
