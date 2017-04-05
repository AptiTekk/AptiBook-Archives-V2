/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

/**
 * Handles the Authentication Tokens which were set to not authenticated by the TenantAuthenticationFilter.
 */
@Component
public class TenantMapAuthenticationTokenProvider implements AuthenticationProvider {

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        /* By simply returning the token, we ensure that Spring knows that it has been handled,
        and therefore will not delete the token. */
        return authentication;
    }

    @Override
    public boolean supports(Class<?> authenticationClass) {
        return authenticationClass.equals(TenantMapAuthenticationToken.class);
    }
}
