/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.authenticationProviders;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.web.security.UserIDAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

/**
 * Authenticates with User entities from the database.
 */
@Component
public class DatabaseAuthenticationProvider implements AuthenticationProvider {

    private final UserRepository userRepository;

    @Autowired
    public DatabaseAuthenticationProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String emailAddress = authentication.getName();

        if (authentication.getCredentials() == null)
            throw new BadCredentialsException("No Password Supplied");
        String password = authentication.getCredentials().toString();

        // Find user with the email and password in the current tenant
        User user = userRepository.findUserWithCredentials(emailAddress, password);
        if (user == null)
            throw new BadCredentialsException("Invalid Username or Password");

        return new UserIDAuthenticationToken(user.getId());
    }

    @Override
    public boolean supports(Class<?> authenticationClass) {
        return authenticationClass.equals(UsernamePasswordAuthenticationToken.class);
    }
}
