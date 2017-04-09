/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.oauth;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
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
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Component
public class GoogleOAuthFilter extends AbstractOAuthFilter {

    private static final String API_KEY = "908953557522-o6m9dri19o1bmh0hrtkjgh6n0522n5lj.apps.googleusercontent.com";
    private static final String API_SECRET = "1asutKqHqijieeqgHGeu-ouE";
    private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
    private static final String GOOGLE_REVOKE_URL = "https://accounts.google.com/o/oauth2/revoke";

    private final UserRepository userRepository;
    private final PropertiesRepository propertiesRepository;
    private final LogService logService;

    @Autowired
    public GoogleOAuthFilter(UserRepository userRepository,
                             PropertiesRepository propertiesRepository,
                             LogService logService) {
        super("google", Property.Key.GOOGLE_SIGN_IN_ENABLED, API_KEY, API_SECRET);
        this.userRepository = userRepository;
        this.propertiesRepository = propertiesRepository;
        this.logService = logService;
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
    User getUserFromOAuthCode(OAuth20Service oAuthService, OAuth2AccessToken accessToken) throws AbstractOAuthFilter.EmailDomainNotAllowedException, InterruptedException, ExecutionException, IOException {
        //Get the User Info from Google
        OAuthRequest request = new OAuthRequest(Verb.GET, GOOGLE_USER_INFO_URL);
        oAuthService.signRequest(accessToken, request);
        Response response = oAuthService.execute(request);

        //Use ObjectMapper to parse the JSON as an Object
        ObjectMapper objectMapper = new ObjectMapper();
        GoogleOAuthUserInfo googleUserInfo = objectMapper.readValue(response.getBody(), GoogleOAuthUserInfo.class);

        if (googleUserInfo != null) {
            // Check to make sure their email domain is whitelisted.
            Property property = propertiesRepository.findPropertyByKey(Property.Key.GOOGLE_SIGN_IN_WHITELIST);
            String[] allowedDomains = property.propertyValue.split(",");

            boolean domainWhitelisted = false;
            // Compare each whitelisted domain to the email
            for (String domain : allowedDomains) {
                if (googleUserInfo.getEmailAddress().contains(domain.trim())) {
                    // The domain is whitelisted.
                    domainWhitelisted = true;
                    break;
                }
            }

            // If the domain is not whitelisted, throw an exception
            if (!domainWhitelisted) {
                throw new EmailDomainNotAllowedException(googleUserInfo.getEmailAddress().substring(googleUserInfo.getEmailAddress().indexOf('@')));
            }

            User user = userRepository.findByEmailAddress(googleUserInfo.getEmailAddress());
            // Check if the user does not yet exist.
            if (user == null) {

                //Create a new user from the oauth details.
                user = new User();
                user.setEmailAddress(googleUserInfo.getEmailAddress());
                user.firstName = googleUserInfo.getFirstName();
                user.lastName = googleUserInfo.getLastName();
                user.verified = true;
                user.userState = User.State.APPROVED;
                user = userRepository.save(user);
            }

            return user;
        }
        return null;
    }

    @Override
    void revokeToken(OAuth20Service oAuthService, OAuth2AccessToken accessToken) throws InterruptedException, ExecutionException, IOException {
        OAuthRequest request = new OAuthRequest(Verb.GET, GOOGLE_REVOKE_URL);
        request.addQuerystringParameter("token", accessToken.getAccessToken());
        Response response = oAuthService.execute(request);
        if (!response.isSuccessful())
            logService.logError(getClass(), "Could not revoke access token: " + response.getMessage());
    }

}
