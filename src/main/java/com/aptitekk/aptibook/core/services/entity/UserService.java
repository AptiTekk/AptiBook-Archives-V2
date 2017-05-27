/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.enums.NotificationType;
import com.aptitekk.aptibook.core.services.annotations.EntityService;


@EntityService
public class UserService {

    /**
     * Determines if the provided User wants email notifications for the provided NotificationType.
     *
     * @param user             The User.
     * @param notificationType The NotificationType to check.
     * @return True if the User wants email notifications, false otherwise.
     */
    public boolean doesUserWantEmailNotifications(User user, NotificationType notificationType) {
        if (user == null)
            throw new IllegalArgumentException("User is null");
        if (notificationType == null)
            throw new IllegalArgumentException("NotificationType is null");

        // Look for the NotificationToggles that pertains to this NotificationType.
        if (user.getNotificationSettings().containsKey(notificationType))
            return user.getNotificationSettings().get(notificationType).isEmailEnabled();

        // The NotificationToggles for the given type does not exist for the User. Using the default value instead.
        return notificationType.getDefaultValue();
    }

}

