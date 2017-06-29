/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.web.security.authenticationproviders.BuiltInAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;

@Configuration
public class AuthenticationConfiguration extends GlobalAuthenticationConfigurerAdapter {

    private final BuiltInAuthenticationProvider builtInAuthenticationProvider;

    @Autowired
    public AuthenticationConfiguration(BuiltInAuthenticationProvider builtInAuthenticationProvider) {
        this.builtInAuthenticationProvider = builtInAuthenticationProvider;
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                // Authenticates using the built-in authentication provider. (Email Address and Password)
                .authenticationProvider(builtInAuthenticationProvider);
    }
}
