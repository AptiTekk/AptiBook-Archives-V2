/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.MultiTenantEntity;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;
import java.util.List;


@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class MultiTenantEntityRepositoryAbstract<T extends MultiTenantEntity> extends EntityRepositoryAbstract<T> {

    @Autowired
    private TenantManagementService tenantManagementService;

    /**
     * Gets the current Tenant for this request.
     *
     * @return The current Tenant, or null if there is not one.
     */
    public Tenant getTenant() {
        return tenantManagementService.getTenant();
    }

    /**
     * Saves the entity to the database. If data for the entity does not exist in the database, it will be inserted.
     * Otherwise, it will be updated.
     * <p>
     * If the entity's tenant is null, the tenant will be assigned automatically.
     *
     * @param entity The entity to save.
     * @return The saved version of the entity.
     */
    @Override
    public T save(T entity) {
        if (entity.getTenant() == null)
            entity.setTenant(getTenant());

        return super.save(entity);
    }

    /**
     * Finds an entity by its id within the current tenant.
     * If the id does not belong to the tenant, the entity will not be found, even if the id exists.
     *
     * @param id The id of the entity to find.
     * @return The entity if found; otherwise null.
     */
    public T findInCurrentTenant(Long id) {
        Tenant tenant = getTenant();
        if (tenant == null || id == null)
            return null;

        try {
            return this.entityManager.createQuery("SELECT e FROM " + this.entityType.getSimpleName() + " e WHERE e.id = :id AND e.tenant = :tenant", entityType)
                    .setParameter("id", id)
                    .setParameter("tenant", tenant)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    /**
     * Finds all entities within the current Tenant.
     *
     * @return A List of all the entities of this type in the current Tenant, or null if there is no current Tenant.
     */
    @Override
    public List<T> findAll() {
        return findAllForTenant(getTenant());
    }

    /**
     * Finds all entities within the specified Tenant.
     *
     * @param tenant The tenant to filter entities by.
     * @return A List of all the entities of this type in the specified Tenant, or null if the Tenant is null.
     */
    public List<T> findAllForTenant(Tenant tenant) {
        if (tenant == null)
            return null;

        TypedQuery<T> query = this.entityManager.createQuery("SELECT e FROM " + this.entityType.getSimpleName() + " e WHERE e.tenant = :tenant", entityType).setParameter("tenant", tenant);
        return query.getResultList();
    }

}
