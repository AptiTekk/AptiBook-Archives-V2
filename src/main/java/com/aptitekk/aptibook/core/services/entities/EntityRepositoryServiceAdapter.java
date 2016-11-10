/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class EntityRepositoryServiceAdapter<T> {

    @Autowired
    private EntityRepository<T> entityRepository;

    @PersistenceContext
    EntityManager entityManager;

    public <S extends T> S save(S entity) {
        return entityRepository.save(entity);
    }

    public <S extends T> List<S> save(Iterable<S> entities) {
        return entityRepository.save(entities);
    }

    public boolean exists(Long id) {
        return entityRepository.exists(id);
    }

    public T findOne(Long id) {
        return entityRepository.findOne(id);
    }

    T findOne(Specification<T> specification) {
        return entityRepository.findOne(specification);
    }

    public List<T> findAll() {
        return entityRepository.findAll();
    }

    List<T> findAll(Sort sort) {
        return entityRepository.findAll(sort);
    }

    List<T> findAll(Iterable<Long> ids) {
        return entityRepository.findAll(ids);
    }

    <S extends T> List<S> findAll(Example<S> example) {
        return entityRepository.findAll(example);
    }

    <S extends T> List<S> findAll(Example<S> example, Sort sort) {
        return entityRepository.findAll(example, sort);
    }

    List<T> findAll(Specification<T> specification) {
        return entityRepository.findAll(specification);
    }

    Page<T> findAll(Specification<T> specification, Pageable pageable) {
        return entityRepository.findAll(specification, pageable);
    }

    List<T> findAll(Specification<T> specification, Sort sort) {
        return entityRepository.findAll(specification, sort);
    }

    long count() {
        return entityRepository.count();
    }

    long count(Specification<T> specification) {
        return entityRepository.count(specification);
    }

    public void delete(Long id) {
        entityRepository.delete(id);
    }

    public void delete(T entity) {
        entityRepository.delete(entity);
    }

    public void deleteInBatch(Iterable<T> entities) {
        entityRepository.deleteInBatch(entities);
    }

    public void deleteAllInBatch() {
        entityRepository.deleteAllInBatch();
    }

}
