/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.enums.property.Property;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class PropertyService {

    private final TenantManagementService tenantManagementService;
    private final TenantRepository tenantRepository;

    @Autowired
    public PropertyService(TenantManagementService tenantManagementService,
                           TenantRepository tenantRepository) {
        this.tenantManagementService = tenantManagementService;
        this.tenantRepository = tenantRepository;
    }

    /**
     * Gets the properties for the current Tenant.
     * Might not contain all keys; use defaults if needed.
     *
     * @return A Map mapping property keys and String values.
     */
    public Map<Property.Key, String> getProperties() {
        return tenantManagementService.getTenant().properties;
    }

    /**
     * Gets a property value from the current Tenant.
     *
     * @param key The key of the property.
     * @return The value stored in the database, or the default if no value is stored.
     */
    public String getProperty(Property.Key key) {
        String existingValue = tenantManagementService.getTenant().properties.get(key);
        return existingValue != null ? existingValue : key.getDefaultValue();
    }

    /**
     * Sets a property value on the current Tenant.
     *
     * @param key   The key of the property to update.
     * @param value The new value for the property.
     */
    public void setProperty(Property.Key key, String value) {
        Tenant tenant = tenantManagementService.getTenant();

        tenant.properties.put(key, value);
        tenantRepository.save(tenant);
    }

    /**
     * Sets all the properties for a Tenant to the provided map.
     *
     * @param properties The properties to store in the Tenant.
     */
    public void setProperties(Map<Property.Key, String> properties) {
        Tenant tenant = tenantManagementService.getTenant();
        tenant.properties = properties;
        tenantRepository.save(tenant);
    }
}
