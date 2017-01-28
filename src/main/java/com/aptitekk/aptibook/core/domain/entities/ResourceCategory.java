/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Entity
public class ResourceCategory extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    public Long id;

    public String name;

    @OneToMany(mappedBy = "resourceCategory", cascade = CascadeType.REMOVE)
    @OrderBy(value = "name")
    public List<Resource> resources = new ArrayList<>();

    @OneToMany(mappedBy = "resourceCategory", cascade = CascadeType.REMOVE)
    public List<ReservationField> reservationFields = new ArrayList<>();

    @OneToMany(mappedBy = "resourceCategory", cascade = CascadeType.REMOVE)
    @OrderBy(value = "name")
    public List<Tag> tags = new ArrayList<>();

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
