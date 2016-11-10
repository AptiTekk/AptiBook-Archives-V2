/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.MultiTenantEntity;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.services.tenant.TenantSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;

import javax.annotation.PostConstruct;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.List;


@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class MultiTenantEntityServiceAbstract<T extends MultiTenantEntity> extends EntityRepository<T> {

    @Autowired
    private TenantSessionService tenantSessionService;

    private Tenant tenant;

    public Tenant getTenant() {
        return tenant;
    }

    class TenantSpecification<S> implements Specification<S> {
        private Tenant defaultTenant;
        private Tenant differentTenant;

        TenantSpecification(Tenant defaultTenant) {
            this.defaultTenant = defaultTenant;
        }

        Specification<S> withDifferentTenant(Tenant tenant) {
            this.differentTenant = tenant;
            return this;
        }

        @Override
        public Predicate toPredicate(Root<S> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
            Predicate predicate = criteriaBuilder.equal(root.get("tenant"), this.differentTenant != null ? this.differentTenant : this.defaultTenant);
            this.differentTenant = null;
            return predicate;
        }
    }

    final TenantSpecification<T> tenantFilterSpecification = new TenantSpecification<>(this.tenant);

    @PostConstruct
    private void init() {
        tenant = tenantSessionService != null ? tenantSessionService.getCurrentTenant() : null;
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
