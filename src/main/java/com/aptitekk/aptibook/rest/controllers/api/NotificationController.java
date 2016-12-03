/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Notification;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.NotificationRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.NotificationDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> getUserNotifications(@PathVariable Long id) {
        if (id == null) {
            return badRequest("Missing ID");
        }
        if (authService.isUserSignedIn()) {
            User user = authService.getCurrentUser();
            if (user.isAdmin() || user.getId().equals(id)) {
                try {
                    List<Notification> notifications = notificationRepository.getAllForUser(user);
                    return ok(modelMapper.map(notifications, new TypeToken<List<NotificationDTO.WithoutUser>>() {
                    }.getType()));
                } catch (Exception e) {
                    return badRequest("Could not parse start or end time.");
                }
            }
            return noPermission();
        }
        return unauthorized();
    }

    @RequestMapping(value = "/notifications/user/{id}/markRead", method = RequestMethod.PATCH)
    public ResponseEntity<?> markAllNotificationsRead(@PathVariable Long id) {
        if (id == null) {
            return badRequest("Missing ID");
        }
        if (authService.isUserSignedIn()) {
            User user = authService.getCurrentUser();
            if (user.isAdmin() || user.getId().equals(id)) {
                try {
                    notificationRepository.markAllAsReadForUser(user);
                    return getUserNotifications(id);
                } catch (Exception e) {
                    return badRequest();
                }
            }
            return noPermission();
        }
        return unauthorized();
    }
}
