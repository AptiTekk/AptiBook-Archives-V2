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

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Entity
public class ReservationFieldEntry extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    public Long id;

    @ManyToOne
    public Reservation reservation;

    @ManyToOne
    public ReservationField field;

    public String content;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof ReservationFieldEntry)) return false;

        ReservationFieldEntry other = (ReservationFieldEntry) o;

        return EqualsHelper.areEquals(content, other.content);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(content);
    }
}
