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
public class Resource extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    public Long id;

    @OneToOne(cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    public File image;

    public String name;

    public boolean needsApproval = false;

    @OneToMany(mappedBy = "resource", cascade = CascadeType.REMOVE)
    @OrderBy("dateCreated desc")
    public List<Reservation> reservations = new ArrayList<>();

    @ManyToOne
    public ResourceCategory resourceCategory;

    @ManyToOne
    public UserGroup owner;

    @ManyToMany
    @OrderBy("name")
    public List<Tag> tags = new ArrayList<>();

    public Resource() {
    }

    public Resource(String name) {
        this.name = name;
    }

    public boolean getHasImage() {
        return this.image != null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Resource)) return false;

        Resource other = (Resource) o;

        return EqualsHelper.areEquals(name, other.name)
                && EqualsHelper.areEquals(needsApproval, other.needsApproval);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(name, needsApproval);
    }

}
