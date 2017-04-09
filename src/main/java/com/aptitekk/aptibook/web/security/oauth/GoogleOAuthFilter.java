/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.oauth;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.github.scribejava.apis.GoogleApi20;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.oauth.OAuth20Service;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Component
public class GoogleOAuthFilter extends AbstractOAuthFilter {

    private static final String API_KEY = "908953557522-o6m9dri19o1bmh0hrtkjgh6n0522n5lj.apps.googleusercontent.com";
    private static final String API_SECRET = "1asutKqHqijieeqgHGeu-ouE";

    public GoogleOAuthFilter() {
        super("google", Property.Key.GOOGLE_SIGN_IN_ENABLED, API_KEY, API_SECRET);
    }

    @Override
    String generateUrl(OAuth20Service oAuth20Service, HttpServletRequest request) {
        final Map<String, String> additionalParams = new HashMap<>();
        additionalParams.put("access_type", "online");
        additionalParams.put("prompt", "consent");
        return oAuth20Service.getAuthorizationUrl(additionalParams);
    }

    @Override
    OAuth20Service buildOAuthService(ServiceBuilder serviceBuilder) {
        serviceBuilder.scope("email");
        return serviceBuilder.build(GoogleApi20.instance());
    }

    @Override
    void handleCallback(HttpServletRequest request) {

    }
}
