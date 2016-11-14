/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.services.auth.GoogleOAuthService;
import com.aptitekk.aptibook.core.services.tenant.TenantSessionService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

@APIController
public class OAuthUrlController extends APIControllerAbstract {

    private final GoogleOAuthService googleOAuthService;
    private final TenantSessionService tenantSessionService;

    @Autowired
    public OAuthUrlController(GoogleOAuthService googleOAuthService, TenantSessionService tenantSessionService) {
        this.googleOAuthService = googleOAuthService;
        this.tenantSessionService = tenantSessionService;
    }

    @RequestMapping("oauthUrl/google")
    public ResponseEntity<?> getGoogleUrl() {
        String signInUrl = googleOAuthService.getSignInUrl(tenantSessionService.getTenant());
        if (signInUrl != null)
            return ok(signInUrl);
        return serverError();
    }

}
