/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.tenant;

import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * This Authentication Token maps a user's session to one or more authenticated Users, with a max of one per Tenant.
 */
public class TenantMapAuthenticationToken extends AbstractAuthenticationToken {

    /**
     * The ID of the current Tenant for this request.
     */
    private Long currentTenantId;

    /**
     * Maps Tenant IDs to User IDs.
     */
    private Map<Long, Long> tenantUserMap = new HashMap<>();

    /**
     * Creates a TenantMapAuthenticationToken.
     */
    public TenantMapAuthenticationToken() {
        super(new ArrayList<>());
    }

    /**
     * Adds an authenticated user to the map (or replaces the existing entry)
     *
     * @param tenantId The ID of the Tenant that the User belongs to.
     * @param userId   The ID of the user mapped to the Tenant.
     */
    public void addAuthenticatedUser(Long tenantId, Long userId) {
        if (tenantId == null)
            throw new IllegalArgumentException("The Tenant ID cannot be null");
        if (userId == null)
            throw new IllegalArgumentException("The User ID cannot be null");
        this.tenantUserMap.put(tenantId, userId);
    }

    /**
     * Removes any authenticated User mapped to the specified Tenant.
     *
     * @param tenantId The ID of the Tenant whose User should be unmapped.
     */
    public void removeAuthenticatedUser(Long tenantId) {
        if (tenantId == null)
            throw new IllegalArgumentException("The Tenant ID cannot be null");
        this.tenantUserMap.remove(tenantId);
    }

    /**
     * Gets the ID of the authenticated User mapped to the Tenant, if one is mapped.
     *
     * @param tenantId The ID of the Tenant that the User ID is mapped to.
     * @return The ID of the User mapped to the Tenant, or null if no User is authenticated for this Tenant.
     */
    public Long getAuthenticatedUserIdForTenant(Long tenantId) {
        return this.tenantUserMap.get(tenantId);
    }

    /**
     * Sets the current Tenant for this request. Used to determine if this token is authenticated for this request.
     *
     * @param tenantId The ID of the current Tenant.
     */
    public void setCurrentTenant(Long tenantId) {
        this.currentTenantId = tenantId;
    }

    /**
     * Gets the ID of the current Tenant for this request.
     *
     * @return The ID of the current Tenant for this request.
     */
    public Long getCurrentTenantId() {
        return this.currentTenantId;
    }

    /**
     * Gets the ID of the authenticated User mapped to the current Tenant, if one is mapped.
     *
     * @return The ID of the User mapped to the current Tenant of this request.
     */
    public Long getCurrentAuthenticatedUserId() {
        return this.tenantUserMap.get(currentTenantId);
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
        return this.tenantUserMap.containsKey(currentTenantId);
    }

    @Override
    public void setAuthenticated(boolean authenticated) {
        throw new UnsupportedOperationException("Cannot manually set authenticated on the TenantMapAuthenticationToken. Use setCurrentTenant instead.");
    }
}
