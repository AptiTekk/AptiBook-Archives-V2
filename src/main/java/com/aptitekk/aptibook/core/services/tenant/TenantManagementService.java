/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.tenant;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.web.security.tenant.TenantDiscoveryFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class TenantManagementService {

    private TenantRepository tenantRepository;

    private HttpServletRequest request;

    @Autowired
    public void setTenantRepository(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @Autowired
    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    /**
     * The Tenants that are allowed access to the application. (To filter out inactive tenants).
     * Key: Domain, Value: Tenant
     */
    private Map<String, Tenant> allowedTenants;

    @PostConstruct
    private void init() {
        refresh();
    }

    public void refresh() {
        refreshAllowedTenants();
    }

    private void refreshAllowedTenants() {
        allowedTenants = new HashMap<>();

        for (Tenant tenant : tenantRepository.findAll()) {
            switch (tenant.getStripeStatus()) {
                case ACTIVE:
                case TRIALING:
                    allowedTenants.put(tenant.getDomain(), tenant);
                    break;
            }
        }
    }

    /**
     * Determines which Tenant domains are allowed for access to the application, to filter out inactive Tenants.
     *
     * @return A Set of valid Tenant domains.
     */
    public Set<String> getAllowedTenantDomains() {
        return allowedTenants.keySet();
    }

    /**
     * Returns a Tenant based on the domain provided.
     *
     * @param domain The domain of the Tenant.
     * @return The Tenant with the corresponding domain, or null.
     */
    public Tenant getTenantByDomain(String domain) {
        return allowedTenants.get(domain);
    }

    /**
     * Gets the Tenant from the HttpServletRequest's "tenant" attribute,
     * which is populated by the TenantLoaderService
     *
     * @return The current Tenant of this request (if in a request, otherwise null)
     */
    public Tenant getTenant() {
        try {
            if (request != null) {
                Object tenantId = request.getAttribute(TenantDiscoveryFilter.TENANT_ATTRIBUTE);
                if (tenantId != null && tenantId instanceof Long)
                    return tenantRepository.find((Long) tenantId);
            }
        } catch (Exception ignored) {
            //No request
        }
        return null;
    }

}
