/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities;

import com.aptitekk.aptibook.util.EqualsHelper;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Tag extends MultiTenantEntity implements Comparable<Tag> {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @ManyToOne(optional = false)
    private ResourceCategory resourceCategory;

    @ManyToMany(mappedBy = "tags")
    private Set<Resource> resources = new HashSet<>();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ResourceCategory getResourceCategory() {
        return resourceCategory;
    }

    public void setResourceCategory(ResourceCategory resourceCategory) {
        this.resourceCategory = resourceCategory;
    }

    public Set<Resource> getResources() {
        return resources;
    }

    public void setResources(Set<Resource> resources) {
        this.resources = resources;
    }

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
