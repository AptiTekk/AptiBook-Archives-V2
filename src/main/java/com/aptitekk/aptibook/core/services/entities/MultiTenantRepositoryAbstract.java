/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.MultiTenantEntity;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PostConstruct;
import javax.persistence.TypedQuery;
import javax.servlet.http.HttpServletRequest;
import java.util.List;


@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class MultiTenantRepositoryAbstract<T extends MultiTenantEntity> extends EntityRepository<T> {

    @Autowired
    private HttpServletRequest httpRequest;

    @Autowired
    private TenantService tenantService;

    private Tenant tenant;

    public Tenant getTenant() {
        return tenant;
    }

    @PostConstruct
    private void init() {
        try {
            if (httpRequest != null)
                httpRequest.getAttribute("tenant");
        } catch (Exception ignored) {
            httpRequest = null;
        }

        if (httpRequest != null) {
            Object attribute = httpRequest.getAttribute("tenant");
            if (attribute != null) {
                Tenant tenantBySlug = tenantService.getTenantBySlug(attribute.toString());
                if (tenantBySlug != null)
                    this.tenant = tenantBySlug;
            }
        }
    }

    @Override
    public T save(T entity) {
        if (entity.getTenant() == null)
            entity.setTenant(tenant);

        return super.save(entity);
    }

    @Override
    public List<T> findAll() {
        return findAllForTenant(tenant);
    }

    public List<T> findAllForTenant(Tenant tenant) {
        TypedQuery<T> query = this.entityManager.createQuery("SELECT e FROM " + this.entityType.getSimpleName() + " e WHERE e.tenant = :tenant", entityType).setParameter("tenant", tenant);
        return query.getResultList();
    }

}
