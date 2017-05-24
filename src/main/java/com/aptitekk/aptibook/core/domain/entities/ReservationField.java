/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
public class ReservationField extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    private String description;

    private boolean required;

    @ManyToOne
    private ResourceCategory resourceCategory;

    private boolean multiLine = false;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<ReservationFieldEntry> reservationFieldEntries = new HashSet<>();

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public ResourceCategory getResourceCategory() {
        return resourceCategory;
    }

    public void setResourceCategory(ResourceCategory resourceCategory) {
        this.resourceCategory = resourceCategory;
    }

    public boolean isMultiLine() {
        return multiLine;
    }

    public void setMultiLine(boolean multiLine) {
        this.multiLine = multiLine;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof ReservationField)) return false;

        ReservationField other = (ReservationField) o;

        return EqualsHelper.areEquals(title, other.title)
                && EqualsHelper.areEquals(description, other.description)
                && EqualsHelper.areEquals(required, other.required)
                && EqualsHelper.areEquals(multiLine, other.multiLine);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(title, description, required, multiLine);
    }

    public Set<ReservationFieldEntry> getReservationFieldEntries() {
        return reservationFieldEntries;
    }

    public void setReservationFieldEntries(Set<ReservationFieldEntry> reservationFieldEntries) {
        this.reservationFieldEntries = reservationFieldEntries;
    }
}
