/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.domain.entities.GlobalEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;

public abstract class GlobalEntityServiceAbstract<T extends GlobalEntity> {

    @Autowired
    protected EntityRepository<T> entityRepository;

}
