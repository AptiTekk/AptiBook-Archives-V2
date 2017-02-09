/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import com.aptitekk.aptibook.core.services.auth.GoogleOAuthService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

@APIController
public class OAuthUrlController extends APIControllerAbstract {

    private final GoogleOAuthService googleOAuthService;
    private final TenantManagementService tenantManagementService1;
    private final PropertiesRepository propertiesRepository;

    @Autowired
    public OAuthUrlController(GoogleOAuthService googleOAuthService,
                              TenantManagementService tenantManagementService,
                              PropertiesRepository propertiesRepository) {
        this.googleOAuthService = googleOAuthService;
        this.tenantManagementService1 = tenantManagementService;
        this.propertiesRepository = propertiesRepository;
    }

    @RequestMapping("oauthUrl/google")
    public ResponseEntity<?> getGoogleUrl() {
        Property googleSignInProperty = propertiesRepository.findPropertyByKey(Property.Key.GOOGLE_SIGN_IN_ENABLED);
        if (Boolean.parseBoolean(googleSignInProperty.propertyValue)) {
            String signInUrl = googleOAuthService.getSignInUrl(tenantManagementService1.getTenant());
            if (signInUrl != null)
                return ok(new OAuthURL(signInUrl));
            return serverError();
        }
        return notImplemented();
    }

    private class OAuthURL {
        private String url;

        OAuthURL(String url) {
            this.url = url;
        }

        public String getUrl() {
            return this.url;
        }

    }

}
