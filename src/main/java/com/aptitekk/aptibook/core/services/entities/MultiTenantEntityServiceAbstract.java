/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.MultiTenantEntity;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.services.tenant.TenantSessionService;
import org.springframework.data.jpa.domain.Specification;

import javax.annotation.PostConstruct;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;


public abstract class MultiTenantEntityServiceAbstract<T extends MultiTenantEntity> extends EntityRepositoryServiceAdapter<T> {

    private final TenantSessionService tenantSessionService;

    private Tenant tenant;

    public Tenant getTenant() {
        return tenant;
    }

    private class TenantSpecification<S> implements Specification<S> {
        private Tenant tenant;

        Specification<S> withTenant(Tenant tenant) {
            this.tenant = tenant;
            return this;
        }

        @Override
        public Predicate toPredicate(Root<S> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
            return criteriaBuilder.equal(root.get("tenant"), this.tenant);
        }
    }

    private final TenantSpecification<T> tenantFilterSpecification = new TenantSpecification<>();

    public MultiTenantEntityServiceAbstract(TenantSessionService tenantSessionService) {
        this.tenantSessionService = tenantSessionService;
    }

    @PostConstruct
    private void init() {
        tenant = tenantSessionService != null ? tenantSessionService.getCurrentTenant() : null;
    }

    @Override
    public <S extends T> S save(S entity) {
        if (entity.getTenant() == null)
            entity.setTenant(tenant);
        return super.save(entity);
    }

    @Override
    <S extends T> Iterable<S> save(Iterable<S> entities) {
        for (S entity : entities)
            if (entity.getTenant() == null)
                entity.setTenant(tenant);

        return super.save(entities);
    }

    @Override
    Iterable<T> findAll() {
        return super.findAll(tenantFilterSpecification.withTenant(this.tenant));
    }

    Iterable<T> findAllForTenant(Tenant tenant) {
        return super.findAll(tenantFilterSpecification.withTenant(tenant));
    }

}
