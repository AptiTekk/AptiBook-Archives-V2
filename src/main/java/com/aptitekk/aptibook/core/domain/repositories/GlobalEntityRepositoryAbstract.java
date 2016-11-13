/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.GlobalEntity;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import java.util.List;

@SuppressWarnings({"SpringAutowiredFieldsWarningInspection", "SpringJavaAutowiredMembersInspection"})
@EntityRepository
public abstract class GlobalEntityRepositoryAbstract<T extends GlobalEntity> extends EntityRepositoryAbstract<T> {

    @Override
    public List<T> findAll() {
        return entityManager.createQuery("SELECT e FROM " + entityType.getSimpleName() + " e", entityType).getResultList();
    }

}
