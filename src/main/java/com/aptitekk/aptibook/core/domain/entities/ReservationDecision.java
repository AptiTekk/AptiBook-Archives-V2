/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Entity
public class ReservationDecision extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @ManyToOne(optional = false)
    private UserGroup userGroup;

    @ManyToOne(optional = false)
    private Reservation reservation;

    private boolean approved;

    /**
     * Not used yet
     */
    private String comment;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserGroup getUserGroup() {
        return userGroup;
    }

    public void setUserGroup(UserGroup userGroup) {
        this.userGroup = userGroup;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public boolean isRejected() {
        return !this.approved;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof ReservationDecision)) return false;

        ReservationDecision other = (ReservationDecision) o;

        return EqualsHelper.areEquals(user, other.user)
                && EqualsHelper.areEquals(userGroup, other.userGroup)
                && EqualsHelper.areEquals(reservation, other.reservation)
                && EqualsHelper.areEquals(approved, other.approved)
                && EqualsHelper.areEquals(comment, other.comment);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(user, userGroup, reservation, approved, comment);
    }

}