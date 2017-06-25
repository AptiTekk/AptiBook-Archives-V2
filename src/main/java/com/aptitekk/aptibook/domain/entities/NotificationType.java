/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities;

public enum NotificationType {

    // Email when your Reservation Request is Approved
    RESERVATION_APPROVED(true, false, null),
    // Email when your Reservation Request is Rejected
    RESERVATION_REJECTED(true, false, null),
    // Email when your Reservation is Cancelled
    RESERVATION_CANCELLED_USER(true, false, null),
    // Email when a Reservation is Requested
    RESERVATION_REQUESTED(true, true, null),
    // Email upon Automatic Approval of a Reservation Request
    RESERVATION_REQUEST_AUTO_APPROVED(false, true, null),
    // Email when a Reservation is Cancelled
    RESERVATION_CANCELLED_USER_GROUPS(true, true, null),
    // Email when a New User Registers
    APPROVAL_REQUEST(true, false, Permission.USERS_MODIFY_ALL);

    private final boolean defaultValue;
    private final boolean userGroupRequired;
    private final Permission requiredPermission;

    NotificationType(boolean defaultValue, boolean userGroupRequired, Permission requiredPermission) {
        this.defaultValue = defaultValue;
        this.userGroupRequired = userGroupRequired;
        this.requiredPermission = requiredPermission;
    }

    public boolean getDefaultValue() {
        return defaultValue;
    }

    public boolean isUserGroupRequired() {
        return userGroupRequired;
    }

    public Permission getRequiredPermission() {
        return requiredPermission;
    }

}