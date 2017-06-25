/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.service.entity;

import com.aptitekk.aptibook.domain.entities.Notification;
import com.aptitekk.aptibook.domain.entities.Reservation;
import com.aptitekk.aptibook.domain.entities.User;
import com.aptitekk.aptibook.domain.entities.UserGroup;
import com.aptitekk.aptibook.domain.entities.NotificationType;
import com.aptitekk.aptibook.domain.repositories.NotificationRepository;
import com.aptitekk.aptibook.service.EmailService;
import com.aptitekk.aptibook.service.annotations.EntityService;
import com.aptitekk.aptibook.util.TimeCommons;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;

@EntityService
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final UserGroupService userGroupService;
    private final EmailService emailService;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                               UserService userService,
                               UserGroupService userGroupService,
                               EmailService emailService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
        this.userGroupService = userGroupService;
        this.emailService = emailService;
    }

    /**
     * Sends a Notification to everyone in the provided collection of User Groups.
     *
     * @param notificationType The type of Notification being sent.
     *                         Used to ensure that Users do not receive notifications in ways they do not want.
     *                         May be null to force a notification to be sent to the web interface.
     * @param subject          The subject of the notification.
     * @param body             The body of the notification.
     * @param userGroups       The collection of User Groups whose Users should receive the Notification.
     */
    public void sendNotification(NotificationType notificationType, String subject, String body, Collection<UserGroup> userGroups) {
        if (subject == null || body == null || userGroups == null)
            return;

        // For every User Group...
        for (UserGroup userGroup : userGroups) {
            // Send the Notification to each User in the Group.
            for (User user : userGroup.getUsers()) {
                sendNotification(notificationType, subject, body, user);
            }
        }
    }

    /**
     * Sends a Notification to a specific User.
     *
     * @param notificationType The type of Notification being sent.
     *                         Used to ensure that Users do not receive notifications in ways they do not want.
     *                         May be null to force a notification to be sent to the web interface.
     * @param subject          The subject of the notification.
     * @param body             The body of the notification.
     * @param user             The User that should receive the Notification.
     */
    public void sendNotification(NotificationType notificationType, String subject, String body, User user) {
        // Create a new Notification entities.
        Notification notification = new Notification(user, subject, body);

        // Save the Notification entities to the database.
        notification = notificationRepository.save(notification);

        // Don't send emails to the admin User. (They have no email).
        if (user.isAdmin())
            return;

        // Don't force a Notification to be sent by email.
        if (notificationType == null)
            return;

        // Check that the User wants email Notifications of this type.
        if (userService.doesUserWantEmailNotifications(user, notificationType))
            emailService.sendEmailNotification(notification);
    }

    /**
     * Sends Notifications to the involved Users when a new Reservation is made.
     * Notifications are sent to the Hierarchy-Up of Users who manage the Resource.
     *
     * @param reservation The Reservation that was created.
     */
    public void sendNewReservationNotifications(Reservation reservation) {
        if (reservation == null)
            return;

        if (reservation.getResource().isNeedsApproval()) {
            sendNotification(NotificationType.RESERVATION_REQUESTED,
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
            sendNotification(NotificationType.RESERVATION_REQUESTED,
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

    /**
     * Sends a Notification to the User who made a Reservation when a concluding Reservation Decision is made upon it.
     *
     * @param reservation The reservation that was decided upon.
     */
    public void sendReservationDecisionNotification(Reservation reservation) {
        if (reservation == null)
            return;

        if (reservation.getStatus() == Reservation.Status.APPROVED) {
            sendNotification(NotificationType.RESERVATION_APPROVED,
                    "Reservation Approved",
                    "Your Reservation for <b>" + reservation.getResource().getName()
                            + "</b> from <b>"
                            + reservation.getStart().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                            + "</b> to <b>"
                            + reservation.getEnd().format(TimeCommons.FRIENDLY_DATE_FORMATTER)
                            + "</b> has been Approved!",
                    reservation.getUser());
        } else if (reservation.getStatus() == Reservation.Status.REJECTED) {
            sendNotification(NotificationType.RESERVATION_REJECTED,
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

    /**
     * Sends Notifications to the involved Users when a Reservation is cancelled.
     * Notifications are sent to the Hierarchy-Up of Users who manage the Resource, as well as the User
     * who reserved the Resource.
     *
     * @param reservation The Reservation that was cancelled.
     */
    public void sendReservationCancelledNotifications(Reservation reservation) {
        if (reservation == null || reservation.getStatus() != Reservation.Status.CANCELLED)
            return;

        sendNotification(NotificationType.RESERVATION_CANCELLED_USER_GROUPS, "Reservation Cancelled",
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

        sendNotification(NotificationType.RESERVATION_CANCELLED_USER, "Reservation Cancelled",
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
