/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.ReservationField;
import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import java.util.List;

@EntityRepository
public class ReservationFieldRepository extends MultiTenantEntityRepositoryAbstract<ReservationField> {

    public List<ReservationField> findAllForResourceCategory(ResourceCategory resourceCategory) {
        return entityManager
                .createQuery("SELECT rf FROM ReservationField rf WHERE rf.resourceCategory = :resourceCategory AND rf.tenant = :tenant", ReservationField.class)
                .setParameter("resourceCategory", resourceCategory)
                .setParameter("tenant", getTenant())
                .getResultList();
    }

    public List<ReservationField> findByTitle(String title, ResourceCategory resourceCategory) {
        if (title == null || resourceCategory == null)
            return null;

        return entityManager
                .createQuery("SELECT r FROM ReservationField r WHERE r.title = :title AND r.resourceCategory = :resourceCategory AND r.tenant = :tenant", ReservationField.class)
                .setParameter("title", title)
                .setParameter("resourceCategory", resourceCategory)
                .setParameter("tenant", getTenant())
                .getResultList();
    }
}
