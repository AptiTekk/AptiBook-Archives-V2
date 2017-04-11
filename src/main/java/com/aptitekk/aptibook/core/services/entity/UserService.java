/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.Notification;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.services.annotations.EntityService;

import java.util.HashSet;
import java.util.Set;


@EntityService
public class UserService {
    public Set<Notification.NotificationSetting> getAllUserNotificationSettings(User user){
            Set<Notification.NotificationSetting> settings = new HashSet<>();
            settings.addAll(user.notificationSetting);
            return settings;
    }

}

