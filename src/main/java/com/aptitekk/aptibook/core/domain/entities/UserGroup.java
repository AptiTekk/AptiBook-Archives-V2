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
    private Long id;

    private String name;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE)
    private List<Resource> resources;

    @JsonIdentityReference(alwaysAsId = true)
    @ManyToMany(mappedBy = "userGroups")
    private List<User> users = new ArrayList<>();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private UserGroup parent;

    @OneToMany(mappedBy = "parent")
    @OrderBy("name ASC")
    private List<UserGroup> children = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Permission> permissions;

    @OneToMany(mappedBy = "userGroup", cascade = CascadeType.REMOVE)
    private List<ReservationDecision> reservationDecisions = new ArrayList<>();

    public UserGroup() {
    }

    public UserGroup(String name) {
        this.name = name;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Resource> getResources() {
        return this.resources;
    }

    public void setResources(List<Resource> rooms) {
        this.resources = rooms;
    }

    public List<User> getUsers() {
        return this.users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public UserGroup getParent() {
        return parent;
    }

    public void setParent(UserGroup parent) {
        this.parent = parent;
    }

    public List<UserGroup> getChildren() {
        return children;
    }

    public void setChildren(List<UserGroup> children) {
        this.children = children;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }

    public List<ReservationDecision> getReservationDecisions() {
        return reservationDecisions;
    }

    public void setReservationDecisions(List<ReservationDecision> reservationDecisions) {
        this.reservationDecisions = reservationDecisions;
    }

    public String toString() {
        return this.getName();
    }

    public boolean isRoot() {
        return this.parent == null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof UserGroup)) return false;

        UserGroup other = (UserGroup) o;

        return EqualsHelper.areEquals(getName(), other.getName());
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(getName());
    }

}