/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Tag extends MultiTenantEntity implements Comparable<Tag> {

    @Id
    @GeneratedValue
    public Long id;

    public String name;

    @ManyToOne(optional = false)
    public ResourceCategory resourceCategory;

    @ManyToMany(mappedBy = "tags")
    public Set<Resource> resources = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Tag)) return false;

        Tag other = (Tag) o;

        return EqualsHelper.areEquals(name, other.name)
                && EqualsHelper.areEquals(resourceCategory, other.resourceCategory);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(name, resourceCategory);
    }

    @Override
    public int compareTo(Tag o) {
        return name.compareTo(o.name);
    }
}
