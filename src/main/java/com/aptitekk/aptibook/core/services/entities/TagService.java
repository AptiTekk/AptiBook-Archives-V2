/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.core.domain.entities.Tag;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.persistence.PersistenceException;
import java.io.Serializable;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class TagService extends MultiTenantRepositoryAbstract<Tag> implements Serializable {

    @Override
    public void delete(Tag tag) {
        if (tag != null) {
            for (Resource resource : tag.getResources()) {
                resource.getTags().remove(tag);
            }
        }

        super.delete(tag);
    }

    public Tag findByName(ResourceCategory resourceCategory, String name) {
        if (resourceCategory == null || name == null)
            return null;

        try {
            return entityManager
                    .createQuery("SELECT t FROM Tag t WHERE t.resourceCategory = ?1 AND t.name = ?2", Tag.class)
                    .setParameter(1, resourceCategory)
                    .setParameter(2, name)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

}
