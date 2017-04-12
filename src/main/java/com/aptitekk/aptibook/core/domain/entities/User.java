/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.domain.entities.enums.NotificationType;
import com.aptitekk.aptibook.core.domain.entities.enums.Permissions;
import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;


@SuppressWarnings("JpaDataSourceORMInspection")
@Entity
@Table(name = "\"user\"")
public class User extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String emailAddress;

    public String firstName;

    public String lastName;

    public String phoneNumber;

    public String location;

    @Column(nullable = false)
    public String hashedPassword;

    public String verificationCode;

    public boolean verified;

    @Enumerated(EnumType.STRING)
    public State userState;

    public enum State {
        APPROVED,
        PENDING;
    }

    @ElementCollection(targetClass = NotificationToggles.class)
    @CollectionTable(name = "user_notification_settings", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "type")
    @MapKeyEnumerated(EnumType.STRING)
    public Map<NotificationType, NotificationToggles> notificationSettings;

    @ManyToMany
    public List<UserGroup> userGroups = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @OrderBy("dateCreated desc")
    public List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    public List<ReservationDecision> reservationDecisions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    public List<Notification> notifications = new ArrayList<>();

    @ElementCollection(targetClass = Permissions.Descriptor.class)
    @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "descriptor")
    public Set<Permissions.Descriptor> permissions;

    public Long getId() {
        return this.id;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    /**
     * Determines if the user is the admin.
     *
     * @return True if the user is the admin, false otherwise.
     */
    public boolean isAdmin() {
        return emailAddress.equalsIgnoreCase("admin");
    }

    /**
     * Gets the full name of the user, or the email address if the first name is empty.
     *
     * @return The user's full name.
     */
    public String getFullName() {
        if (firstName == null || firstName.isEmpty())
            return getEmailAddress();
        else
            return firstName + (lastName == null ? "" : " " + lastName);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof User)) return false;

        User other = (User) o;

        return EqualsHelper.areEquals(emailAddress, other.emailAddress)
                && EqualsHelper.areEquals(firstName, other.firstName)
                && EqualsHelper.areEquals(lastName, other.lastName)
                && EqualsHelper.areEquals(phoneNumber, other.phoneNumber)
                && EqualsHelper.areEquals(location, other.location)
                && EqualsHelper.areEquals(hashedPassword, other.hashedPassword)
                && EqualsHelper.areEquals(verificationCode, other.verificationCode)
                && EqualsHelper.areEquals(verified, other.verified);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(emailAddress, firstName, lastName, phoneNumber, location, hashedPassword, verificationCode, verified);
    }

    /**
     * Describes the different toggleable notification methods.
     */
    @Embeddable
    public static class NotificationToggles implements Serializable {

        /**
         * Whether or not email notifications are enabled.
         */
        @Column(name = "email_enabled")
        private boolean emailEnabled;

        /**
         * Constructs a new instance with the given parameters.
         *
         * @param emailEnabled Whether or not email notifications are enabled.
         */
        public NotificationToggles(boolean emailEnabled) {
            this.emailEnabled = emailEnabled;
        }

        /**
         * Constructs a new instance with false enabled fields.
         */
        public NotificationToggles() {
        }

        public boolean isEmailEnabled() {
            return emailEnabled;
        }

        public void setEmailEnabled(boolean enabled) {
            this.emailEnabled = enabled;
        }
    }

}
