/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
public class ResourceCategory extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    public Long id;

    public String name;

    @OneToMany(mappedBy = "resourceCategory", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @OrderBy(value = "name")
    public Set<Resource> resources = new HashSet<>();

    @OneToMany(mappedBy = "resourceCategory", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    public Set<ReservationField> reservationFields = new HashSet<>();

    @OneToMany(mappedBy = "resourceCategory", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    public Set<Tag> tags = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof ResourceCategory)) return false;

        ResourceCategory other = (ResourceCategory) o;

        return EqualsHelper.areEquals(name, other.name);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(name);
    }
}
