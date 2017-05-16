/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.authenticationProviders;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.enums.property.AuthenticationMethod;
import com.aptitekk.aptibook.core.domain.entities.enums.property.Property;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.security.PasswordUtils;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.aptitekk.aptibook.web.security.UserIDAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * Authenticates with User entities from the database.
 */
@Component
public class BuiltInAuthenticationProvider implements AuthenticationProvider {

    private final TenantManagementService tenantManagementService;
    private final UserRepository userRepository;
    private final HttpServletRequest httpServletRequest;

    @Autowired
    public BuiltInAuthenticationProvider(TenantManagementService tenantManagementService,
                                         UserRepository userRepository,
                                         HttpServletRequest httpServletRequest) {
        this.tenantManagementService = tenantManagementService;
        this.userRepository = userRepository;
        this.httpServletRequest = httpServletRequest;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        // Check for an X-Auth-Type header, which determines if this is authentication for an admin or a regular user.
        if (httpServletRequest.getHeader("X-Auth-Type") != null) {
            if (httpServletRequest.getHeader("X-Auth-Type").equalsIgnoreCase("admin")) {
                // Admin Authentication

                // Get the password supplied
                if (authentication.getCredentials() == null)
                    throw new BadCredentialsException("No Password Supplied.");
                String password = authentication.getCredentials().toString();

                // Find the Admin User
                User adminUser = userRepository.findAdminUser();

                // Check the Admin's password
                if (PasswordUtils.passwordsMatch(password, adminUser.getHashedPassword()))
                    return new UserIDAuthenticationToken(adminUser.getId());
                throw new BadCredentialsException("Incorrect Password.");
            } else if (httpServletRequest.getHeader("X-Auth-Type").equalsIgnoreCase("user")) {
                // Check the authentication method.
                String authenticationMethod = tenantManagementService.getTenant().getProperties().get(Property.Key.AUTHENTICATION_METHOD);
                if (authenticationMethod != null && AuthenticationMethod.valueOf(authenticationMethod) != AuthenticationMethod.BUILT_IN)
                    throw new AuthenticationServiceException("Built-In Authentication is not Enabled.");

                // Regular User Authentication
                String emailAddress = authentication.getName();

                // Get the password supplied
                if (authentication.getCredentials() == null)
                    throw new BadCredentialsException("No Password Supplied.");
                String password = authentication.getCredentials().toString();

                // Find the User with the email address supplied
                User user = userRepository.findByEmailAddress(emailAddress);
                if (user == null)
                    throw new BadCredentialsException("Incorrect Email Address or Password.");

                // Check the User's password
                if (PasswordUtils.passwordsMatch(password, user.getHashedPassword()))
                    return new UserIDAuthenticationToken(user.getId());
                throw new BadCredentialsException("Incorrect Password.");
            }
        }

        throw new BadCredentialsException("Missing X-Auth-Type Header.");
    }

    @Override
    public boolean supports(Class<?> authenticationClass) {
        return authenticationClass.equals(UsernamePasswordAuthenticationToken.class);
    }
}
