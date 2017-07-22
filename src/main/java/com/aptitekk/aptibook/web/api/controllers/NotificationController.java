/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.Notification;
import com.aptitekk.aptibook.domain.entities.User;
import com.aptitekk.aptibook.domain.repositories.NotificationRepository;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.dtos.NotificationDTO;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@APIController
public class NotificationController extends APIControllerAbstract {

    private final NotificationRepository notificationRepository;

    @Autowired
    NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @RequestMapping(value = "/notifications/user/{id}", method = RequestMethod.GET)
    public APIResponse getUserNotifications(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        if (!user.isAdmin() && !user.getId().equals(id))
            return APIResponse.noPermission();

        try {
            List<Notification> notifications = notificationRepository.getAllForUser(user);
            return APIResponse.okResponse(modelMapper.map(notifications, new TypeToken<List<NotificationDTO>>() {
            }.getType()));
        } catch (Exception e) {
            return APIResponse.badRequestNotParsable("Could not parse start or end time.");
        }
    }

    @RequestMapping(value = "/notifications/user/{id}/markRead", method = RequestMethod.PATCH)
    public APIResponse markAllNotificationsRead(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        if (!user.isAdmin() && !user.getId().equals(id))
            return APIResponse.noPermission();

        try {
            notificationRepository.markAllAsReadForUser(user);
            return getUserNotifications(id);
        } catch (Exception e) {
            return APIResponse.internalServerError();
        }
    }
}
