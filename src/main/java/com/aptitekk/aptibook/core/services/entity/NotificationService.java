/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.repositories.NotificationRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.core.services.annotations.EntityService;
import com.aptitekk.aptibook.core.util.TimeCommons;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@EntityService
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserGroupService userGroupService;

    private final EmailService emailService;

    private final UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserGroupService userGroupService, EmailService emailService, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userGroupService = userGroupService;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public void sendNotification(Notification.Type type, String subject, String body, List<UserGroup> userGroupList) {
        if (subject == null || body == null || userGroupList == null)
            return;

        for (UserGroup userGroup : userGroupList) {
            for (User user : userGroup.getUsers()) {
                sendNotification(type, subject, body, user);
            }
        }
    }

    public void sendNotification(Notification.Type type, String subject, String body, User user) {
        Notification notification = new Notification(user, subject, body);
        notification = notificationRepository.save(notification);
        if (!user.isAdmin() && (type == null || user.getNotificationTypeSettings().get(type)))
            emailService.sendEmailNotification(notification);
    }

    public void sendNewUserRegistrationNotifications(User newUser) {
        List<User> recipients = userRepository.findUsersWithPermission(Permission.Descriptor.USERS_MODIFY_ALL);
        for (User user : recipients) {
            sendNotification(Notification.Type.TYPE_APPROVAL_REQUEST,
                    "New User Registration",
                    "A new user, <b>" + newUser.getFullName() +
                            "</b>, has registered for AptiBook, and is waiting for approval to sign in. " +
                            "Please approve or reject this user.",
                    user);
        }
    }

    public void sendNewReservationNotifications(Reservation reservation) {
        if (reservation == null)
            return;

        if (reservation.getResource().getNeedsApproval()) {
            sendNotification(Notification.Type.TYPE_RESERVATION_REQUESTED,
                    "New Reservation Request",
                    "A new Reservation for <b>"
                            + reservation.getResource().getName()
                            + "</b> has been requested by "
                            + "<b>"
                            + reservation.getUser().getFullName()
                            + "</b>"
                            + ".",
                    userGroupService.getHierarchyUp(reservation.getResource().getOwner()));
        } else {
            sendNotification(Notification.Type.TYPE_RESERVATION_REQUESTED,
                    "New Reservation Approved",
                    "A new Reservation for <b>"
                            + reservation.getResource().getName()
                            + "</b> has been automatically <i>approved</i> for "
                            + "<b>"
                            + reservation.getUser().getFullName()
                            + "</b>"
                            + ".",
                    userGroupService.getHierarchyUp(reservation.getResource().getOwner()));
        }
    }

    public void sendReservationDecisionNotification(Reservation reservation) {
        if (reservation == null)
            return;

        if (reservation.getStatus() == Reservation.Status.APPROVED) {
            sendNotification(Notification.Type.TYPE_RESERVATION_APPROVED,
                    "Reservation Approved",
                    "Your Reservation for <b>" + reservation.getResource().getName()
                            + "</b> from <b>"
                            + reservation.getStart().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                            + "</b> to <b>"
                            + reservation.getEnd().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                            + "</b> has been Approved!",
                    reservation.getUser());
        } else if (reservation.getStatus() == Reservation.Status.REJECTED) {
            sendNotification(Notification.Type.TYPE_RESERVATION_REJECTED,
                    "Reservation Rejected",
                    "Your Reservation for <b>" + reservation.getResource().getName()
                            + "</b> from <b>"
                            + reservation.getStart().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                            + "</b> to <b>"
                            + reservation.getEnd().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                            + "</b> has been Rejected.",
                    reservation.getUser());
        }
    }

    public void sendReservationCancelledNotifications(Reservation reservation) {
        if (reservation == null || reservation.getStatus() != Reservation.Status.CANCELLED)
            return;

        sendNotification(Notification.Type.TYPE_RESERVATION_CANCELLED_USER_GROUPS, "Reservation Cancelled",
                "The reservation of <b>"
                        + reservation.getResource().getName()
                        + "</b> for <b>"
                        + reservation.getTitle()
                        + "</b>, which was requested by <b>"
                        + reservation.getUser().getFullName()
                        + "</b> from <b>"
                        + reservation.getStart().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                        + "</b> to <b>"
                        + reservation.getEnd().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                        + "</b>, has been Cancelled.",
                userGroupService.getHierarchyUp(reservation.getResource().getOwner())
        );

        sendNotification(Notification.Type.TYPE_RESERVATION_CANCELLED_USER, "Reservation Cancelled",
                "Your reservation of <b>"
                        + reservation.getResource().getName()
                        + "</b> for <b>"
                        + reservation.getTitle()
                        + "</b> from <b>"
                        + reservation.getStart().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                        + "</b> to <b>"
                        + reservation.getEnd().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                        + "</b> has been Cancelled.",
                reservation.getUser()
        );
    }
}
