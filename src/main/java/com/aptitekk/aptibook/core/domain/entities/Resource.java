/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
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
    private Long id;

    @OneToOne(cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private File image;

    private String name;

    private Boolean needsApproval = false;

    @OneToMany(mappedBy = "resource", cascade = CascadeType.REMOVE)
    @OrderBy("dateCreated desc")
    private List<Reservation> reservations = new ArrayList<>();

    @JsonIdentityReference(alwaysAsId = true)
    @ManyToOne
    private ResourceCategory resourceCategory;

    @JsonIdentityReference(alwaysAsId = true)
    @ManyToOne
    private UserGroup owner;

    @ManyToMany
    @OrderBy("name")
    private List<Tag> tags = new ArrayList<>();

    public Resource() {
    }

    public Resource(String name) {
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

    public Boolean getNeedsApproval() {
        return this.needsApproval;
    }

    public void setNeedsApproval(Boolean needsApproval) {
        this.needsApproval = needsApproval;
    }

    public List<Reservation> getReservations() {
        return this.reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public ResourceCategory getResourceCategory() {
        return resourceCategory;
    }

    public void setResourceCategory(ResourceCategory type) {
        this.resourceCategory = type;
    }

    public UserGroup getOwner() {
        return owner;
    }

    public void setOwner(UserGroup owner) {
        this.owner = owner;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public File getImage() {
        return image;
    }

    public void setImage(File image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Resource)) return false;

        Resource other = (Resource) o;

        return EqualsHelper.areEquals(getName(), other.getName())
                && EqualsHelper.areEquals(getNeedsApproval(), other.getNeedsApproval());
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(getName(), getNeedsApproval());
    }

}
