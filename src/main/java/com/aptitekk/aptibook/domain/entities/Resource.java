/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities;

import com.aptitekk.aptibook.util.EqualsHelper;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Resource extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private File image;

    private String name;

    private boolean needsApproval = false;

    @OneToMany(mappedBy = "resource", cascade = CascadeType.REMOVE)
    @OrderBy("dateCreated desc")
    private List<Reservation> reservations = new ArrayList<>();

    @ManyToOne
    private ResourceCategory resourceCategory;

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
        return id;
    }

    public File getImage() {
        return image;
    }

    public void setImage(File image) {
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isNeedsApproval() {
        return needsApproval;
    }

    public void setNeedsApproval(boolean needsApproval) {
        this.needsApproval = needsApproval;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public ResourceCategory getResourceCategory() {
        return resourceCategory;
    }

    public void setResourceCategory(ResourceCategory resourceCategory) {
        this.resourceCategory = resourceCategory;
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
