/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@SuppressWarnings("JpaDataSourceORMInspection")
@Entity
public class UserGroup extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE)
    private List<Resource> resources;

    @ManyToMany(mappedBy = "userGroups")
    private List<User> users = new ArrayList<>();

    @ManyToOne
    private UserGroup parent;

    @OneToMany(mappedBy = "parent")
    @OrderBy("name ASC")
    private List<UserGroup> children = new ArrayList<>();

    @ElementCollection(targetClass = Permission.class)
    @CollectionTable(name = "usergroup_permissions", joinColumns = @JoinColumn(name = "usergroup_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "permission")
    private Set<Permission> permissions;

    @OneToMany(mappedBy = "userGroup", cascade = CascadeType.REMOVE)
    private List<ReservationDecision> reservationDecisions = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public List<User> getUsers() {
        return users;
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

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public List<ReservationDecision> getReservationDecisions() {
        return reservationDecisions;
    }

    public void setReservationDecisions(List<ReservationDecision> reservationDecisions) {
        this.reservationDecisions = reservationDecisions;
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
