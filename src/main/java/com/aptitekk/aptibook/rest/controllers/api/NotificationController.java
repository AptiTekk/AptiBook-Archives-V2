/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Notification;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.repositories.NotificationRepository;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@APIController
public class NotificationController extends APIControllerAbstract {

    private final NotificationRepository notificationRepository;

    @Autowired
    NotificationController( NotificationRepository notificationRepository){
        this.notificationRepository = notificationRepository;
    }


    @RequestMapping(value = "/notifications/user/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserNotifications(@PathVariable Long id) {
        if (id == null) {
            System.out.println("Id is null");
            return badRequest("Missing ID");
        }
        if (authService.isUserSignedIn()) {
            System.out.println("Id not null");
            User user = authService.getCurrentUser();
            if (user.isAdmin() || user.getId().equals(id)) {
                try {
                    System.out.println("almost there");
                    List<Notification> list = notificationRepository.getAllForUser(user);
                    if(list != null){
                        System.out.println("List size: " + list.size());

                    }else{
                        System.out.println("It is null");
                    }
                    return ok(notificationRepository.getAllForUser(user));
                  //  return ok(reservationRepository.findReservationsWithFilters(startLocalDateTime, endLocalDateTime, user, null));
                } catch (Exception e) {
                    System.out.println("catch hit");
                    return badRequest("Could not parse start or end time.");
                }
            }
            return noPermission();
        }
        return unauthorized();
    }

}
