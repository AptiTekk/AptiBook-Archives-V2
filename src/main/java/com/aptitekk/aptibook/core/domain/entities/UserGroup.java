/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;
import com.fasterxml.jackson.annotation.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Entity
public class UserGroup extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    public Long id;

    public String name;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE)
    public List<Resource> resources;

    @JsonIdentityReference(alwaysAsId = true)
    @ManyToMany(mappedBy = "userGroups")
    public List<User> users = new ArrayList<>();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    public UserGroup parent;

    @OneToMany(mappedBy = "parent")
    @OrderBy("name ASC")
    public List<UserGroup> children = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    public List<Permission> permissions;

    @OneToMany(mappedBy = "userGroup", cascade = CascadeType.REMOVE)
    public List<ReservationDecision> reservationDecisions = new ArrayList<>();

    public boolean isRoot() {
        return this.parent == null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof UserGroup)) return false;

        UserGroup other = (UserGroup) o;

        return EqualsHelper.areEquals(name, other.name);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(name);
    }

}
