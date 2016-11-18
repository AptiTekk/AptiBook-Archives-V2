/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;
import com.fasterxml.jackson.annotation.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@SuppressWarnings("JpaDataSourceORMInspection")
@Entity
@Table(name = "\"user\"")
public class User extends MultiTenantEntity implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    private String emailAddress;

    private String firstName;

    private String lastName;

    private String phoneNumber;

    private String location;

    @JsonIgnore
    private String hashedPassword;

    @JsonIgnore
    private String verificationCode;

    @JsonIgnore
    private boolean verified;

    @JsonIgnore
    @Enumerated(EnumType.STRING)
    private State userState;

    public enum State {
        APPROVED,
        PENDING;
    }

    @SuppressWarnings("JpaAttributeTypeInspection")
    private Map<Notification.Type, Boolean> notificationTypeSettings = new HashMap<>();

    @JsonIdentityReference(alwaysAsId = true)
    @ManyToMany
    private List<UserGroup> userGroups = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @OrderBy("dateCreated desc")
    private List<Reservation> reservations = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<ReservationDecision> reservationDecisions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private List<Notification> notifications = new ArrayList<>();

    @ManyToMany
    private List<Permission> permissions;

    public Long getId() {
        return this.id;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        if (emailAddress != null)
            emailAddress = emailAddress.toLowerCase();
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verficationCode) {
        this.verificationCode = verficationCode;
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

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }

    public State getUserState() {
        return userState;
    }

    public void setUserState(State userState) {
        this.userState = userState;
    }

    public Map<Notification.Type, Boolean> getNotificationTypeSettings() {
        return notificationTypeSettings;
    }

    public void setNotificationTypeSettings(Map<Notification.Type, Boolean> notificationTypeSettings) {
        this.notificationTypeSettings = notificationTypeSettings;
    }

    /**
     * Gets the full name of the user, or the email address if the first name is empty.
     *
     * @return The user's full name.
     */
    public String getFullName() {
        if (getFirstName() == null || getFirstName().isEmpty())
            return getEmailAddress();
        else
            return getFirstName() + (getLastName() == null ? "" : " " + getLastName());
    }

    /**
     * Determines if the user is the admin.
     *
     * @return True if the user is the admin, false otherwise.
     */
    public boolean isAdmin() {
        return getEmailAddress().equalsIgnoreCase("admin");
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof User)) return false;

        User other = (User) o;

        return EqualsHelper.areEquals(getEmailAddress(), other.getEmailAddress())
                && EqualsHelper.areEquals(getFirstName(), other.getFirstName())
                && EqualsHelper.areEquals(getLastName(), other.getLastName())
                && EqualsHelper.areEquals(getPhoneNumber(), other.getPhoneNumber())
                && EqualsHelper.areEquals(getLocation(), other.getLocation())
                && EqualsHelper.areEquals(getHashedPassword(), other.getHashedPassword())
                && EqualsHelper.areEquals(getVerificationCode(), other.getVerificationCode())
                && EqualsHelper.areEquals(isVerified(), other.isVerified());
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(getEmailAddress(), getFirstName(), getLastName(), getPhoneNumber(), getLocation(), getHashedPassword(), getVerificationCode(), isVerified());
    }

}
