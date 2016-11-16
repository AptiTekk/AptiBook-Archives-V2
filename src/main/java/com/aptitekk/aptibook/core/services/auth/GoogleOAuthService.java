/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.auth;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.oauth.GoogleUserInfo;
import com.aptitekk.aptibook.core.services.LogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.scribejava.apis.GoogleApi20;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.model.OAuth2AccessToken;
import com.github.scribejava.core.model.OAuthRequest;
import com.github.scribejava.core.model.Response;
import com.github.scribejava.core.model.Verb;
import com.github.scribejava.core.oauth.OAuth20Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleOAuthService {

    private static final String GOOGLE_API_KEY = "908953557522-o6m9dri19o1bmh0hrtkjgh6n0522n5lj.apps.googleusercontent.com";
    private static final String GOOGLE_API_SECRET = "-mXdL_YoL6Q6HrLIF7lUZpAo";
    private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
    private static final String GOOGLE_REVOKE_URL = "https://accounts.google.com/o/oauth2/revoke";

    private final UserRepository userRepository;
    private final HttpServletRequest httpServletRequest;
    private final LogService logService;

    @Autowired
    public GoogleOAuthService(UserRepository userRepository, HttpServletRequest httpServletRequest, LogService logService) {
        this.userRepository = userRepository;
        this.httpServletRequest = httpServletRequest;
        this.logService = logService;
    }

    public String getSignInUrl(Tenant tenant) {
        OAuth20Service oAuthService = buildService(tenant.getSlug());
        final Map<String, String> additionalParams = new HashMap<>();
        additionalParams.put("access_type", "online");
        additionalParams.put("prompt", "consent");
        return oAuthService.getAuthorizationUrl(additionalParams);
    }

    public User getUserFromCode(Tenant tenant, String code) {
        OAuth20Service googleOAuthService = buildService(tenant.getSlug());

        try {
            OAuth2AccessToken accessToken = googleOAuthService.getAccessToken(code);

            //Get the User Info from Google
            OAuthRequest request = new OAuthRequest(Verb.GET, GOOGLE_USER_INFO_URL, googleOAuthService);
            googleOAuthService.signRequest(accessToken, request);
            Response response = request.send();

            //Use ObjectMapper to parse the JSON as an Object
            ObjectMapper objectMapper = new ObjectMapper();
            GoogleUserInfo googleUserInfo = objectMapper.readValue(response.getBody(), GoogleUserInfo.class);

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
                    user.setTenant(tenant);
                    user.setVerified(true);
                    user.setUserState(User.State.APPROVED);
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

    private OAuth20Service buildService(String tenantSlug) {
        ServiceBuilder serviceBuilder = new ServiceBuilder();
        serviceBuilder.apiKey(GOOGLE_API_KEY);
        serviceBuilder.apiSecret(GOOGLE_API_SECRET);

        String url = httpServletRequest.getRequestURL().toString();
        String[] urlSplit = url.split("/");
        serviceBuilder.callback(urlSplit[0] + "//" + urlSplit[2] + "/oauth/google");

        serviceBuilder.scope("email");
        serviceBuilder.state("tenant=" + tenantSlug);

        return serviceBuilder.build(GoogleApi20.instance());
    }
}
