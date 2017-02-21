/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.services.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.lang.reflect.ParameterizedType;
import java.util.List;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
@Transactional
public abstract class EntityRepositoryAbstract<T> {

    Class<T> entityType;

    @Autowired
    LogService logService;

    @PostConstruct
    private void init() {
        ParameterizedType parameterizedType = (ParameterizedType) getClass().getGenericSuperclass();
        //noinspection unchecked
        this.entityType = (Class<T>) parameterizedType.getActualTypeArguments()[0];
    }

    @PersistenceContext
    EntityManager entityManager;

    /**
     * Saves the entity to the database. If data for the entity does not exist in the database, it will be inserted.
     * Otherwise, it will be updated.
     *
     * @param entity The entity to save.
     * @return The saved version of the entity.
     */
    public T save(T entity) {
        return this.entityManager.merge(entity);
    }

    public T find(Long id) {
        return this.entityManager.find(this.entityType, id);
    }

    public abstract List<T> findAll();

    public void delete(T entity) {
        entityManager.remove(entityManager.contains(entity) ? entity : entityManager.merge(entity));
    }

}
