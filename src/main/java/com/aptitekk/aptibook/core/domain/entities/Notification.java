/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.domain.entities.enums.Permissions;
import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
public class Notification extends MultiTenantEntity implements Serializable {

    public enum Type {

        TYPE_RESERVATION_APPROVED("Email when your Reservation Request is Approved", true, false, null),
        TYPE_RESERVATION_REJECTED("Email when your Reservation Request is Rejected", true, false, null),
        TYPE_RESERVATION_CANCELLED_USER("Email when your Reservation is Cancelled", true, false, null),
        TYPE_RESERVATION_REQUESTED("Email when a Reservation is Requested", true, true, null),
        TYPE_RESERVATION_REQUEST_AUTO_APPROVED("Email upon Automatic Approval of a Reservation Request", false, true, null),
        TYPE_RESERVATION_CANCELLED_USER_GROUPS("Email when a Reservation is Cancelled", true, true, null),
        TYPE_APPROVAL_REQUEST("Email when a New User Registers", true, false, Permissions.Descriptor.USERS_MODIFY_ALL);

        private final String label;
        private final boolean defaultValue;
        private final boolean userGroupRequired;
        private final Permissions.Descriptor requiredPermissionDescriptor;

        Type(String label, boolean defaultValue, boolean userGroupRequired, Permissions.Descriptor requiredPermissionDescriptor) {
            this.label = label;
            this.defaultValue = defaultValue;
            this.userGroupRequired = userGroupRequired;
            this.requiredPermissionDescriptor = requiredPermissionDescriptor;
        }

        public String getLabel() {
            return label;
        }

        public boolean getDefaultValue() {
            return defaultValue;
        }

        public boolean isUserGroupRequired() {
            return userGroupRequired;
        }

        public Permissions.Descriptor getRequiredPermissionDescriptor() {
            return requiredPermissionDescriptor;
        }
    }

    @Id
    @GeneratedValue
    public Long id;

    @ManyToOne
    public User user;

    public String subject;

    public String body;

    public LocalDateTime creation = LocalDateTime.now();

    public boolean notif_read = false;

    public Notification() {
        super();
    }

    public Notification(User user, String subject, String body) {
        this.user = user;
        this.subject = subject;
        this.body = body;
    }

    public boolean getRead() {
        return notif_read;
    }

    public void setRead(boolean notif_read) {
        this.notif_read = notif_read;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Notification)) return false;

        Notification other = (Notification) o;

        return EqualsHelper.areEquals(subject, other.subject)
                && EqualsHelper.areEquals(body, other.body)
                && EqualsHelper.areEquals(creation, other.creation)
                && EqualsHelper.areEquals(notif_read, other.notif_read);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(subject, body, creation, notif_read);
    }

}
