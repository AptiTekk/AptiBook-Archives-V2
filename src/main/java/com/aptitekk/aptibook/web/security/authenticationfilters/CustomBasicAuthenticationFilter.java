/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.authenticationfilters;

import com.aptitekk.aptibook.web.security.APIAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.stereotype.Component;

/**
 * Overrides the {@link BasicAuthenticationFilter} in order to autowire the application's
 * {@link org.springframework.security.web.AuthenticationEntryPoint} into the constructor.
 */
@Component
public class CustomBasicAuthenticationFilter extends BasicAuthenticationFilter {

    @Autowired
    public CustomBasicAuthenticationFilter(
            AuthenticationManager authenticationManager,
            APIAuthenticationEntryPoint authenticationEntryPoint) {
        super(authenticationManager, authenticationEntryPoint);
    }
}
