/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;
import org.apache.tools.ant.taskdefs.condition.Not;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.*;


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

   /* public String[][] getNotificationTypeSettingsArray() {
        String[][] entrySet = new String[notificationTypeSettings.entrySet().size()][2];
        for(int i = 0; i < notificationTypeSettings.entrySet().size(); i++){
            Notification.Type key = (Notification.Type)notificationTypeSettings.keySet().toArray()[i];
            String value = notificationTypeSettings.get(key).toString();
            entrySet[i][0] = key.getLabel();
            entrySet[i][1] = value;
        }
        return entrySet;
    }*/

 /*   @Transient
    private String[][] notificationTypeSettingsArray;*/


    @ElementCollection(targetClass = Notification.NotificationSetting.class)
    @CollectionTable(name = "notifications",joinColumns = @JoinColumn(name = "user_id"))
    public Set<Notification.NotificationSetting> notificationSetting;


    @SuppressWarnings("JpaAttributeTypeInspection")
    public Map<Notification.Type, Boolean> notificationTypeSettings = new HashMap<>();



    @ManyToMany
    public List<UserGroup> userGroups = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @OrderBy("dateCreated desc")
    public List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    public List<ReservationDecision> reservationDecisions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    public List<Notification> notifications = new ArrayList<>();

    @ManyToMany
    public List<Permission> permissions;

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

}
