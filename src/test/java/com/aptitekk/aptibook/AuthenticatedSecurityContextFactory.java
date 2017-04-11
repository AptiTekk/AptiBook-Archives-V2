/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook;

import com.aptitekk.aptibook.web.security.UserIDAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

/**
 * Builds the SecurityContext used by the Authenticated annotation.
 */
public class AuthenticatedSecurityContextFactory
        implements WithSecurityContextFactory<Authenticated> {
    @Override
    public SecurityContext createSecurityContext(Authenticated authenticated) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UserIDAuthenticationToken(authenticated.userId()));
        return context;
    }
}