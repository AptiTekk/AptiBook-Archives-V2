/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities;

import com.aptitekk.aptibook.domain.entities.serializers.LocalDateTimeSerializer;
import com.aptitekk.aptibook.util.EqualsHelper;
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
    private Long id;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    private LocalDateTime dateCreated = LocalDateTime.now();

    private String title;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(name="\"start\"")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    private LocalDateTime start;

    @Column(name="\"end\"")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeSerializer.Deserializer.class)
    private LocalDateTime end;

    @ManyToOne
    private Resource resource;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.REMOVE)
    private List<ReservationDecision> decisions;

    public Long getId() {
        return id;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
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

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
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
