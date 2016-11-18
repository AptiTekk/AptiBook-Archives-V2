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
import java.time.ZonedDateTime;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
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
    private Long id;

    private ZonedDateTime dateCreated = ZonedDateTime.now();

    private String title;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private ZonedDateTime start;

    private ZonedDateTime end;

    @ManyToOne
    private Resource resource;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.REMOVE)
    private List<ReservationDecision> decisions;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.REMOVE)
    private List<ReservationFieldEntry> fieldEntries;

    public Long getId() {
        return id;
    }

    public ZonedDateTime getDateCreated() {
        return dateCreated;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Status getStatus() {
        return status;
    }

    public boolean isPending() {
        return status == Status.PENDING;
    }

    public boolean isApproved() {
        return status == Status.APPROVED;
    }

    public boolean isRejected() {
        return status == Status.REJECTED;
    }

    public boolean isCancelled(){return status == Status.CANCELLED;}

    public void setStatus(Status status) {
        this.status = status;
    }

    public ZonedDateTime getStart() {
        return start;
    }

    public void setStart(ZonedDateTime startTime) {
        this.start = startTime;
    }

    public ZonedDateTime getEnd() {
        return end;
    }

    public void setEnd(ZonedDateTime endTime) {
        this.end = endTime;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<ReservationDecision> getDecisions() {
        return decisions;
    }

    public void setDecisions(List<ReservationDecision> decisions) {
        this.decisions = decisions;
    }

    public List<ReservationFieldEntry> getFieldEntries() {
        return fieldEntries;
    }

    public void setFieldEntries(List<ReservationFieldEntry> fieldEntries) {
        this.fieldEntries = fieldEntries;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Reservation)) return false;

        Reservation other = (Reservation) o;

        return EqualsHelper.areEquals(getTitle(), other.getTitle())
                && EqualsHelper.areEquals(getDateCreated(), other.getDateCreated())
                && EqualsHelper.areEquals(getStatus(), other.getStatus())
                && EqualsHelper.areEquals(getStart(), other.getStart())
                && EqualsHelper.areEquals(getEnd(), other.getEnd());
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(getTitle(), getDateCreated(), getStatus(), getStart(), getEnd());
    }
}
