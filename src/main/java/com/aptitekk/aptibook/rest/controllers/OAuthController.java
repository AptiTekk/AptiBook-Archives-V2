/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.oauth.GoogleUserInfo;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.auth.AuthService;
import com.github.scribejava.apis.GoogleApi20;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.model.OAuth2AccessToken;
import com.github.scribejava.core.model.OAuthRequest;
import com.github.scribejava.core.model.Response;
import com.github.scribejava.core.model.Verb;
import com.github.scribejava.core.oauth.OAuth20Service;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class OAuthController {

    private static final String GOOGLE_API_KEY = "908953557522-o6m9dri19o1bmh0hrtkjgh6n0522n5lj.apps.googleusercontent.com";
    private static final String GOOGLE_API_SECRET = "-mXdL_YoL6Q6HrLIF7lUZpAo";
    private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
    private static final String GOOGLE_REVOKE_URL = "https://accounts.google.com/o/oauth2/revoke";

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final LogService logService;

    @Autowired
    public OAuthController(TenantRepository tenantRepository, UserRepository userRepository, AuthService authService, LogService logService) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.authService = authService;
        this.logService = logService;
    }

    @RequestMapping("oauth")
    public void onOAuthCallback(HttpServletResponse httpServletResponse,
                                @RequestParam(value = "state", required = false) String state,
                                @RequestParam(value = "code", required = false) String code) {
        if (state != null && !state.isEmpty() && code != null && !code.isEmpty()) {
            String[] stateSplit = state.split("=");
            if (stateSplit.length == 2) {
                String tenantSlug = stateSplit[1];
                Tenant tenant = tenantRepository.findTenantBySlug(tenantSlug);
                if (tenant != null) {
                    User user = getUserFromCode(tenant, code);
                    if (user != null) {
                        authService.setUserOfTenant(user, tenant, httpServletResponse);
                    }
                }
                try {
                    httpServletResponse.sendRedirect("/" + tenantSlug + "/");
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

    private OAuth20Service buildService(String tenantSlug) {
        ServiceBuilder serviceBuilder = new ServiceBuilder();
        serviceBuilder.apiKey(GOOGLE_API_KEY);
        serviceBuilder.apiSecret(GOOGLE_API_SECRET);

        serviceBuilder.callback("/oauth");

        serviceBuilder.scope("email");
        serviceBuilder.state("tenant=" + tenantSlug);

        return serviceBuilder.build(GoogleApi20.instance());
    }

    private User getUserFromCode(Tenant tenant, String code) {
        OAuth20Service googleOAuthService = buildService(tenant.getSlug());

        try {
            OAuth2AccessToken accessToken = googleOAuthService.getAccessToken(code);

            //Get the User Info from Google
            OAuthRequest request = new OAuthRequest(Verb.GET, GOOGLE_USER_INFO_URL, googleOAuthService);
            googleOAuthService.signRequest(accessToken, request);
            Response response = request.send();

            //Usee GSON to parse the request into an object
            Gson gson = new GsonBuilder().create();
            GoogleUserInfo googleUserInfo = gson.fromJson(response.getBody(), GoogleUserInfo.class);
            if (googleUserInfo != null) {

                //Find user from google email.
                User user = userRepository.findByEmailAddress(googleUserInfo.getEmail(), tenant);

                //User does not yet exist
                if (user == null) {

                    //Create user
                    user = new User();
                    user.setEmailAddress(googleUserInfo.getEmail());
                    user.setFirstName(googleUserInfo.getFirstName());
                    user.setLastName(googleUserInfo.getLastName());
                    user = userRepository.save(user);
                }

                //Revoke the token, we are done with it.
                request = new OAuthRequest(Verb.GET, GOOGLE_REVOKE_URL, googleOAuthService);
                request.addQuerystringParameter("token", accessToken.getAccessToken());
                response = request.send();
                if (!response.isSuccessful())
                    logService.logError(getClass(), "Could not revoke access token: " + response.getMessage());

                return user;
            }
        } catch (Exception e) {
            logService.logException(getClass(), e, "Could not parse code");
        }
        return null;
    }

}
