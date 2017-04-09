/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.root;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.auth.AuthService;
import com.aptitekk.aptibook.web.security.oauth.GoogleOAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class OAuthCallbackController {

    private final TenantRepository tenantRepository;
    private final PropertiesRepository propertiesRepository;
    private final GoogleOAuthService googleOAuthService;
    private final AuthService authService;
    private final LogService logService;

    @Autowired
    public OAuthCallbackController(TenantRepository tenantRepository, PropertiesRepository propertiesRepository, GoogleOAuthService googleOAuthService, AuthService authService, LogService logService) {
        this.tenantRepository = tenantRepository;
        this.propertiesRepository = propertiesRepository;
        this.googleOAuthService = googleOAuthService;
        this.authService = authService;
        this.logService = logService;
    }

    @RequestMapping("oauth/google")
    public void onOAuthCallback(HttpServletResponse httpServletResponse,
                                @RequestParam(value = "state", required = false) String state,
                                @RequestParam(value = "code", required = false) String code,
                                @RequestParam(value = "error", required = false) String error) {
        if (state != null && !state.isEmpty()) {

            //Determine Tenant from state
            String[] stateSplit = state.split("=");
            if (stateSplit.length == 2) {
                String tenantSlug = stateSplit[1];
                Tenant tenant = tenantRepository.findTenantBySlug(tenantSlug);

                //Make sure that google sign in is actually enabled
                Property googleSignInProperty = propertiesRepository.findPropertyByKey(Property.Key.GOOGLE_SIGN_IN_ENABLED, tenant);
                if (googleSignInProperty != null && Boolean.parseBoolean(googleSignInProperty.propertyValue)) {

                    //Check for code and set the appropriate user if the code exists.
                    if (code != null && !code.isEmpty()) {
                        if (tenant != null) {
                            /*try {
                                User user = googleOAuthService.getUserFromCode(tenant, code);
                                //authService.setUserOfTenant(user, tenant, httpServletResponse);
                            } catch (GoogleOAuthService.DomainNotWhitelistedException e) {
                                redirectToTenantWithError(httpServletResponse, tenantSlug, "not-whitelisted");
                                return;
                            } catch (GoogleOAuthService.InvalidCodeException e) {
                                redirectToTenantWithError(httpServletResponse, tenantSlug, "invalid-code");
                                return;
                            }*/
                        }
                    }
                    //Google error
                    redirectToTenantWithError(httpServletResponse, tenantSlug, error);
                    return;
                } else {
                    //Tried to use google but it wasn't enabled.
                    redirectToTenantWithError(httpServletResponse, tenantSlug, "inactive");
                    return;
                }
            }
        }

        //When all else fails...
        redirectToWebRoot(httpServletResponse);
    }

    private void redirectToTenantWithError(HttpServletResponse httpServletResponse, String tenantSlug, String error) {
        try {
            httpServletResponse.sendRedirect("/" + tenantSlug + (error != null ? "?googleError=" + error : ""));
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not redirect to tenant root");
            redirectToWebRoot(httpServletResponse);
        }
    }

    private void redirectToWebRoot(HttpServletResponse httpServletResponse) {
        try {
            httpServletResponse.sendRedirect("/");
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not redirect to web root");
        }
    }

}
