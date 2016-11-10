/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.ReservationField;
import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class ReservationFieldService extends MultiTenantEntityServiceAbstract<ReservationField> implements Serializable {

    public List<ReservationField> getAllForResourceCategory(ResourceCategory resourceCategory) {
        return entityManager
                .createQuery("SELECT rf FROM ReservationField rf WHERE rf.resourceCategory = ?1 AND rf.tenant = ?2", ReservationField.class)
                .setParameter(1, resourceCategory)
                .setParameter(2, getTenant())
                .getResultList();
    }

    public List<ReservationField> findByTitle(String title, ResourceCategory resourceCategory) {
        if (title == null || resourceCategory == null)
            return null;

        return entityManager
                .createQuery("SELECT r FROM ReservationField r WHERE r.title = ?1 AND r.resourceCategory = ?2 AND r.tenant = ?3", ReservationField.class)
                .setParameter(1, title)
                .setParameter(2, resourceCategory)
                .setParameter(3, getTenant())
                .getResultList();
    }
}
