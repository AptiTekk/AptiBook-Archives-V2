/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.oauth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;
import org.springframework.stereotype.Component;

import javax.servlet.Filter;

/**
 * Contains code necessary to generate a Google OAuth Filter
 */
@Component
public class GoogleOAuthDetails {

    private final OAuth2ClientContext oAuth2ClientContext;

    @Autowired
    public GoogleOAuthDetails(@Qualifier("oauth2ClientContext") OAuth2ClientContext oAuth2ClientContext) {
        this.oAuth2ClientContext = oAuth2ClientContext;
    }

    public Filter generateGoogleOAuthFilter() {
        OAuth2ClientAuthenticationProcessingFilter googleOAuthFilter = new OAuth2ClientAuthenticationProcessingFilter("/api/oauth/google");

        OAuth2RestTemplate googleOAuthTemplate = new OAuth2RestTemplate(generateGoogleOAuthResourceDetails(), oAuth2ClientContext);
        googleOAuthFilter.setRestTemplate(googleOAuthTemplate);

        UserInfoTokenServices userInfoTokenServices = new UserInfoTokenServices(generateGoogleOAuthResourceServerProperties().getUserInfoUri(), generateGoogleOAuthResourceDetails().getClientId());
        userInfoTokenServices.setRestTemplate(googleOAuthTemplate);
        googleOAuthFilter.setTokenServices(userInfoTokenServices);

        return googleOAuthFilter;
    }

    @Bean
    @ConfigurationProperties("oauth.google.client")
    private AuthorizationCodeResourceDetails generateGoogleOAuthResourceDetails() {
        return new AuthorizationCodeResourceDetails();
    }

    @Bean
    @ConfigurationProperties("oauth.google.resource")
    private ResourceServerProperties generateGoogleOAuthResourceServerProperties() {
        return new ResourceServerProperties();
    }

}
