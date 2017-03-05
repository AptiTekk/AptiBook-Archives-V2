/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class File extends MultiTenantEntity {

    @Id
    @GeneratedValue
    public Long id;

    public byte[] data;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof File)) return false;

        File other = (File) o;

        return EqualsHelper.areEquals(data, other.data);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode((Object) data);
    }
}
