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
    public Long id;

    public String title;

    public String description;

    public boolean required;

    @ManyToOne
    public ResourceCategory resourceCategory;

    public boolean multiLine = false;

    @OneToMany(cascade = CascadeType.ALL)
    public Set<ReservationFieldEntry> reservationFieldEntries = new HashSet<>();

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
