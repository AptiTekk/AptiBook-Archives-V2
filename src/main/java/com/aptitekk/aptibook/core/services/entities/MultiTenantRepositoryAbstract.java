/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.MultiTenantEntity;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;
import javax.servlet.http.HttpServletRequest;
import java.util.List;


@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class MultiTenantRepositoryAbstract<T extends MultiTenantEntity> extends EntityRepository<T> {

    @Autowired
    private HttpServletRequest httpRequest;

    public Tenant getTenant() {
        try {
            if (httpRequest != null)
                httpRequest.getAttribute("tenant");
        } catch (Exception ignored) {
        }

        if (httpRequest != null) {
            Object attribute = httpRequest.getAttribute("tenant");
            if (attribute != null && attribute instanceof Tenant)
                return (Tenant) attribute;
        }
        return null;
    }

    @Override
    public T save(T entity) {
        if (entity.getTenant() == null)
            entity.setTenant(getTenant());

        return super.save(entity);
    }

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

    @Override
    public List<T> findAll() {
        return findAllForTenant(getTenant());
    }

    public List<T> findAllForTenant(Tenant tenant) {
        TypedQuery<T> query = this.entityManager.createQuery("SELECT e FROM " + this.entityType.getSimpleName() + " e WHERE e.tenant = :tenant", entityType).setParameter("tenant", tenant);
        return query.getResultList();
    }

}
