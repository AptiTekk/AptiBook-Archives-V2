/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities;

import com.aptitekk.aptibook.util.EqualsHelper;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
public class ResourceCategory extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToMany(mappedBy = "resourceCategory", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @OrderBy(value = "name")
    private Set<Resource> resources = new HashSet<>();

    @OneToMany(mappedBy = "resourceCategory", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Tag> tags = new HashSet<>();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Resource> getResources() {
        return resources;
    }

    public void setResources(Set<Resource> resources) {
        this.resources = resources;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

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
