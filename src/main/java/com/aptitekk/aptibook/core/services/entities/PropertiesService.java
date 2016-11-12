/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.Property;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.boot.autoconfigure.web.WebMvcProperties;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.persistence.PersistenceException;
import java.util.List;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class PropertiesService extends MultiTenantRepositoryAbstract<Property> {

    /**
     * Gets the Property Entity that matches the Property Key, within the current Tenant.
     *
     * @param propertyKey The Property Key.
     * @return the Property Entity if found, null otherwise.
     */
    public Property getPropertyByKey(Property.Key propertyKey) {
        return getPropertyByKey(propertyKey, getTenant());
    }

    /**
     * Gets the Property Entity that matches the Property Key, within the specified Tenant.
     *
     * @param propertyKey The Property Key.
     * @param tenant      The Tenant of the Property to search for.
     * @return the Property Entity if found, null otherwise.
     */
    public Property getPropertyByKey(Property.Key propertyKey, Tenant tenant) {
        if (propertyKey == null || tenant == null)
            return null;

        try {
            return entityManager
                    .createQuery("SELECT p FROM Property p WHERE p.propertyKey = :propertyKey AND p.tenant = :tenant", Property.class)
                    .setParameter("propertyKey", propertyKey)
                    .setParameter("tenant", tenant)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }


    /**
     * Gets the Property Entities whose Keys are assigned to the specified Property Group, within the current Tenant.
     *
     * @param propertyGroup The Property Group to filter by.
     * @return A list containing all Property Entities that are within the Group.
     */
    public List<Property> getAllPropertiesByGroup(Property.Group propertyGroup) {
        return getAllPropertiesByGroup(propertyGroup, getTenant());
    }

    /**
     * Gets the Property Entities whose Keys are assigned to the specified Property Group, within the specified Tenant.
     *
     * @param propertyGroup The Property Group to filter by.
     * @param tenant        The Tenant of the Properties to search for.
     * @return A list containing all Property Entities that are within the Group.
     */
    public List<Property> getAllPropertiesByGroup(Property.Group propertyGroup, Tenant tenant) {
        if (propertyGroup == null || tenant == null)
            return null;

        try {
            return entityManager.createQuery("SELECT p from Property p WHERE p.propertyKey IN :propertyKeys AND p.tenant = :tenant", Property.class)
                    .setParameter("propertyKeys", propertyGroup.getKeys())
                    .setParameter("tenant", tenant)
                    .getResultList();
        } catch (PersistenceException e) {
            return null;
        }
    }
}
