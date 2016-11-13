/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.PersistenceException;
import java.util.Comparator;
import java.util.List;

@EntityRepository
public class ResourceRepository extends MultiTenantEntityRepositoryAbstract<Resource> {

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
                    .createQuery("SELECT r FROM Resource r WHERE r.name = :name AND r.resourceCategory = :resourceCategory AND r.tenant = :tenant", Resource.class)
                    .setParameter("name", name)
                    .setParameter("resourceCategory", resourceCategory)
                    .setParameter("tenant", getTenant())
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
