/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.domain.entities.enums.NotificationType;
import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
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

    private boolean admin;

    private String emailAddress;

    private String firstName;

    private String lastName;

    private String phoneNumber;

    @Column(nullable = false)
    private String hashedPassword;

    private String verificationCode;

    private boolean verified;

    private String casId;

    @ManyToMany
    private List<UserGroup> userGroups = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @OrderBy("dateCreated desc")
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<ReservationDecision> reservationDecisions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<Notification> notifications = new ArrayList<>();

    @ElementCollection(targetClass = NotificationToggles.class)
    @CollectionTable(name = "user_notification_settings", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "type")
    @MapKeyEnumerated(EnumType.STRING)
    private Map<NotificationType, NotificationToggles> notificationSettings;

    @ElementCollection(targetClass = Permission.Descriptor.class)
    @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "descriptor")
    private Set<Permission.Descriptor> permissions;

    public Long getId() {
        return this.id;
    }

    public boolean isAdmin() {
        return this.admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getCasId() {
        return casId;
    }

    public void setCasId(String casId) {
        this.casId = casId;
    }

    public List<UserGroup> getUserGroups() {
        return userGroups;
    }

    public void setUserGroups(List<UserGroup> userGroups) {
        this.userGroups = userGroups;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public List<ReservationDecision> getReservationDecisions() {
        return reservationDecisions;
    }

    public void setReservationDecisions(List<ReservationDecision> reservationDecisions) {
        this.reservationDecisions = reservationDecisions;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public Map<NotificationType, NotificationToggles> getNotificationSettings() {
        return notificationSettings;
    }

    public void setNotificationSettings(Map<NotificationType, NotificationToggles> notificationSettings) {
        this.notificationSettings = notificationSettings;
    }

    public Set<Permission.Descriptor> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission.Descriptor> permissions) {
        this.permissions = permissions;
    }

    /**
     * Gets the full name of the user, or the email address if the first name is empty.
     *
     * @return The user's full name.
     */
    public String getFullName() {
        if (admin)
            return "Admin";

        if (firstName == null || firstName.isEmpty())
            return getEmailAddress();

        return firstName + (lastName == null ? "" : " " + lastName);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof User)) return false;

        User other = (User) o;

        return EqualsHelper.areEquals(emailAddress, other.emailAddress)
                && EqualsHelper.areEquals(admin, other.admin)
                && EqualsHelper.areEquals(firstName, other.firstName)
                && EqualsHelper.areEquals(lastName, other.lastName)
                && EqualsHelper.areEquals(phoneNumber, other.phoneNumber)
                && EqualsHelper.areEquals(hashedPassword, other.hashedPassword)
                && EqualsHelper.areEquals(verificationCode, other.verificationCode)
                && EqualsHelper.areEquals(verified, other.verified);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(emailAddress, admin, firstName, lastName, phoneNumber, hashedPassword, verificationCode, verified);
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
