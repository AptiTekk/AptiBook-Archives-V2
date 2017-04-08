/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.ArrayList;

/**
 * An authentication token that includes only a User's ID.
 */
public class UserIDAuthenticationToken extends AbstractAuthenticationToken {

    /**
     * The User's ID.
     */
    private Long userId;

    /**
     * Creates a new token with the provided User ID.
     *
     * @param userId The User's ID.
     */
    public UserIDAuthenticationToken(Long userId) {
        super(new ArrayList<>());
        this.userId = userId;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }

    /**
     * Retrieves the ID of the authenticated User.
     *
     * @return The ID of the User who is authenticated with this Token.
     */
    public Long getUserId() {
        return this.userId;
    }

    @Override
    public boolean isAuthenticated() {
        return true;
    }
}
