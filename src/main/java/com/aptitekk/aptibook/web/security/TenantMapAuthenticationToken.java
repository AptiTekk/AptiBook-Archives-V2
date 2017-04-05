/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * This Authentication Token maps a user's session to one or more authenticated Users, with a max of one per Tenant.
 */
public class TenantMapAuthenticationToken extends AbstractAuthenticationToken {

    /**
     * Maps Tenants to the authenticated users' IDs.
     */
    private Map<Tenant, Long> tenantUserIdMap = new HashMap<>();

    /**
     * Creates a TenantMapAuthenticationToken.
     */
    public TenantMapAuthenticationToken() {
        super(new ArrayList<>());
    }

    /**
     * Adds an authenticated user to the map (or replaces the existing entry)
     *
     * @param tenant The Tenant that the User belongs to.
     * @param userId The ID of the user mapped to the Tenant.
     */
    public void addAuthenticatedUser(Tenant tenant, Long userId) {
        if (tenant == null)
            throw new IllegalArgumentException("The Tenant cannot be null");
        if (userId == null)
            throw new IllegalArgumentException("The User ID cannot be null");
        this.tenantUserIdMap.put(tenant, userId);
    }

    /**
     * Removes the authenticated User's ID (if one exists) for the Tenant.
     *
     * @param tenant The Tenant whose mapped User is no longer authenticated.
     */
    public void removeAuthenticatedUser(Tenant tenant) {
        if (tenant == null)
            throw new IllegalArgumentException("The Tenant cannot be null");
        this.tenantUserIdMap.remove(tenant);
    }

    /**
     * Gets the authenticated User's ID mapped to the Tenant, if one exists.
     *
     * @param tenant The Tenant that the User ID is mapped to.
     * @return The User ID mapped to the Tenant, or null if no User is authenticated.
     */
    public Long getUserIdForTenant(Tenant tenant) {
        return this.tenantUserIdMap.get(tenant);
    }

    /**
     * Not used for this Authentication Token.
     *
     * @return null
     */
    @Override
    public Object getCredentials() {
        return null;
    }

    /**
     * Not used for this Authentication Token.
     *
     * @return null
     */
    @Override
    public Object getPrincipal() {
        return null;
    }

    @Override
    public boolean isAuthenticated() {
            return super.isAuthenticated();
    }
}
