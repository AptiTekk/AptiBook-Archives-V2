/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.oauth;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.domain.rest.oauth.GoogleUserInfo;
import com.aptitekk.aptibook.core.services.LogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.scribejava.apis.GoogleApi20;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.exceptions.OAuthException;
import com.github.scribejava.core.model.OAuth2AccessToken;
import com.github.scribejava.core.model.OAuthRequest;
import com.github.scribejava.core.model.Response;
import com.github.scribejava.core.model.Verb;
import com.github.scribejava.core.oauth.OAuth20Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleOAuthService {

    private static final String GOOGLE_API_KEY = "908953557522-o6m9dri19o1bmh0hrtkjgh6n0522n5lj.apps.googleusercontent.com";
    private static final String GOOGLE_API_SECRET = "1asutKqHqijieeqgHGeu-ouE";
    private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
    private static final String GOOGLE_REVOKE_URL = "https://accounts.google.com/o/oauth2/revoke";

    private final UserRepository userRepository;
    private final HttpServletRequest httpServletRequest;
    private final LogService logService;
    private final PropertiesRepository propertiesRepository;

    @Autowired
    public GoogleOAuthService(UserRepository userRepository, HttpServletRequest httpServletRequest, LogService logService, PropertiesRepository propertiesRepository) {
        this.userRepository = userRepository;
        this.httpServletRequest = httpServletRequest;
        this.logService = logService;
        this.propertiesRepository = propertiesRepository;
    }

    /*public User getUserFromCode(Tenant tenant, String code) throws DomainNotWhitelistedException, InvalidCodeException {
        OAuth20Service googleOAuthService = buildService(tenant.slug);

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
                // Check to make sure their email domain is whitelisted.
                Property property = propertiesRepository.findPropertyByKey(Property.Key.GOOGLE_SIGN_IN_WHITELIST, tenant);
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
                    throw new DomainNotWhitelistedException();
                }

                User user = userRepository.findByEmailAddress(googleUserInfo.getEmailAddress(), tenant);
                // Check if the user does not yet exist.
                if (user == null) {

                    //Create a new user from the oauth details.
                    user = new User();
                    user.tenant = tenant;
                    user.setEmailAddress(googleUserInfo.getEmailAddress());
                    user.firstName = googleUserInfo.getFirstName();
                    user.lastName = googleUserInfo.getLastName();
                    user.verified = true;
                    user.userState = User.State.APPROVED;
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
        } catch (IOException e) {
            logService.logException(getClass(), e, "Could not parse code");
        } catch (OAuthException e) {
            throw new InvalidCodeException();
        }
        return null;
    }
*/


    /**
     * An exception thrown when getting an oauth user whose email domain is not whitelisted.
     */
    public class DomainNotWhitelistedException extends Exception {
    }

    /**
     * An exception thrown when the provided oauth code is invalid.
     */
    public class InvalidCodeException extends Exception {
    }
}
