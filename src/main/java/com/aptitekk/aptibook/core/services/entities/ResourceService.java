/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.persistence.PersistenceException;
import java.io.Serializable;
import java.util.Comparator;
import java.util.List;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class ResourceService extends MultiTenantEntityServiceAbstract<Resource> implements Serializable {

    @Autowired
    private ResourceCategoryService resourceCategoryService;

    /**
     * Finds Resource by its name within an Resource Category.
     *
     * @param name             The name of the Resource.
     * @param resourceCategory The Resource Category to search within.
     * @return An Resource with the specified name, or null if one does not exist.
     */
    public Resource findByName(String name, ResourceCategory resourceCategory) {
        if (name == null || resourceCategory == null)
            return null;

        try {
            return entityManager
                    .createQuery("SELECT r FROM Resource r WHERE r.name = ?1 AND r.resourceCategory = ?2 AND r.tenant = ?3", Resource.class)
                    .setParameter(1, name)
                    .setParameter(2, resourceCategory)
                    .setParameter(3, getTenant())
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

    @Override
    public List<Resource> findAll() {
        List<Resource> resources = super.findAll();
        resources.sort(new ResourceComparator());
        return resources;
    }

    @Override
    public List<Resource> findAllForTenant(Tenant tenant) {
        List<Resource> resources = super.findAllForTenant(tenant);
        resources.sort(new ResourceComparator());
        return resources;
    }

    /**
     * Sorts Resource Categories by name.
     */
    private class ResourceComparator implements Comparator<Resource> {

        @Override
        public int compare(Resource o1, Resource o2) {
            return o1.getName().compareTo(o2.getName());
        }
    }

}
