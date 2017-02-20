/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.domain.entities.serializers.LocalDateTimeSerializer;
import com.aptitekk.aptibook.core.util.EqualsHelper;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@SuppressWarnings("JpaDataSourceORMInspection")
@Entity
public class Reservation extends MultiTenantEntity implements Serializable {
    public enum Status {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    public Long id;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    public LocalDateTime dateCreated = LocalDateTime.now();

    public String title;

    @Enumerated(EnumType.STRING)
    public Status status = Status.PENDING;

    @Column(name="\"start\"")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    public LocalDateTime start;

    @Column(name="\"end\"")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    public LocalDateTime end;

    @ManyToOne
    public Resource resource;

    @ManyToOne
    public User user;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    public List<ReservationDecision> decisions;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.REMOVE)
    public List<ReservationFieldEntry> fieldEntries;

    public boolean isPending() {
        return status == Status.PENDING;
    }

    public boolean isApproved() {
        return status == Status.APPROVED;
    }

    public boolean isRejected() {
        return status == Status.REJECTED;
    }

    public boolean isCancelled() {
        return status == Status.CANCELLED;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Reservation)) return false;

        Reservation other = (Reservation) o;

        return EqualsHelper.areEquals(title, other.title)
                && EqualsHelper.areEquals(dateCreated, other.dateCreated)
                && EqualsHelper.areEquals(status, other.status)
                && EqualsHelper.areEquals(start, other.start)
                && EqualsHelper.areEquals(end, other.end);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(title, dateCreated, status, start, end);
    }
}
