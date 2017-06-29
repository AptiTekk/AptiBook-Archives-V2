/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.authentication_providers;

import com.aptitekk.aptibook.domain.entities.User;
import com.aptitekk.aptibook.domain.entities.property.Property;
import com.aptitekk.aptibook.domain.repositories.UserRepository;
import com.aptitekk.aptibook.service.tenant.TenantManagementService;
import com.aptitekk.aptibook.util.PasswordUtils;
import com.aptitekk.aptibook.web.security.UserIDAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
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
        if (httpServletRequest.getHeader("X-Auth-Type").equalsIgnoreCase("admin")) {
            // Admin Authentication
            return authenticateAdmin((UsernamePasswordAuthenticationToken) authentication);
        } else {
            // Regular User Authentication
            return authenticateUser((UsernamePasswordAuthenticationToken) authentication);
        }
    }

    /**
     * Authenticates the Admin User.
     *
     * @param authentication The authentication token containing the provided credentials.
     * @return An authentication token with the Admin's User ID if everything went ok.
     * @throws AuthenticationException If authentication failed.
     */
    private UserIDAuthenticationToken authenticateAdmin(UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
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
    }

    /**
     * Authenticates a regular User.
     *
     * @param authentication The authentication token containing the provided credentials.
     * @return An authentication token with the User's ID if everything went ok.
     * @throws AuthenticationException If authentication failed.
     */
    private UserIDAuthenticationToken authenticateUser(UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
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
        throw new BadCredentialsException("Incorrect Email Address or Password.");
    }

    @Override
    public boolean supports(Class<?> authenticationClass) {

        // Only UsernamePasswordAuthenticationTokens are supported.
        if (authenticationClass.equals(UsernamePasswordAuthenticationToken.class)) {

            // Check that the Authentication Method for this Tenant is set to BUILT_IN. If it is, we are good to go.
            String authenticationMethod = tenantManagementService.getTenant().getProperties().get(Property.AUTHENTICATION_METHOD);
            if (authenticationMethod == null || Property.AuthenticationMethod.valueOf(authenticationMethod) == Property.AuthenticationMethod.BUILT_IN)
                return true;

            // Authentication method is not BUILT_IN. Check if we are authenticating as an Admin.
            String authTypeHeader = httpServletRequest.getHeader("X-Auth-Type");
            if (authTypeHeader != null && authTypeHeader.equalsIgnoreCase("admin")) {
                // Authenticating as admin, so we can continue.
                return true;
            }
        }

        return false;
    }
}
