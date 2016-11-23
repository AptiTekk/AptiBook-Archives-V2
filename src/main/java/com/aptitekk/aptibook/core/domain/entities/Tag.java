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
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Entity
public class Tag extends MultiTenantEntity implements Comparable<Tag> {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private ResourceCategory resourceCategory;

    @JsonIgnore
    @ManyToMany(mappedBy = "tags")
    private List<Resource> resources = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long idTag) {
        this.id = idTag;
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

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Tag)) return false;

        Tag other = (Tag) o;

        return EqualsHelper.areEquals(getName(), other.getName()) && EqualsHelper.areEquals(getResourceCategory(), other.getResourceCategory());
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(getName(), getResourceCategory());
    }

    @Override
    public int compareTo(Tag o) {
        return name.compareTo(o.getName());
    }
}
