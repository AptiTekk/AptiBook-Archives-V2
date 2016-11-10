/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.GlobalEntity;

import java.util.List;

@SuppressWarnings({"SpringAutowiredFieldsWarningInspection", "SpringJavaAutowiredMembersInspection"})
public abstract class GlobalEntityServiceAbstract<T extends GlobalEntity> extends EntityRepository<T> {

    @Override
    public List<T> findAll() {
        return entityManager.createQuery("SELECT e FROM " + entityType + " e", entityType).getResultList();
    }

}
