/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {Notification} from "../../../../models/notification.model";
import {AuthService} from "../../../../core/services/auth.service";
import {NotificationService} from "../../../../core/services/notification.service";
import * as moment from "moment";
import Moment = moment.Moment;
import {CurrentUserService} from "../../../../core/services/current-user.service";
import {User} from "../../../../models/user.model";
@Component({
    selector: 'at-account-notifications',
    templateUrl: 'notifications.component.html',
    styleUrls: ['notifications.component.css']
})
export class AccountNotificationsComponent implements OnInit {

    /**
     * The currently signed-in User.
     */
    private currentUser: User;

    /**
     * All the notifications for the User.
     */
    notifications: Notification[] = [];

    /**
     * Only the unread notifications for the User.
     */
    unreadNotifications: Notification[] = [];

    //noinspection JSMethodCanBeStatic
    getTimeAgo(unreadNotification: Notification) {
        if (unreadNotification != undefined && unreadNotification != null)
            return moment(unreadNotification.creation).fromNow();
    }

    constructor(private currentUserService: CurrentUserService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.currentUserService.getCurrentUser().subscribe(user => this.currentUser = user);

        this.notificationService.reloadNotifications();
        this.notificationService.getNotifications().take(1).subscribe(notifications => {
                this.notifications = notifications;
                this.notificationService.markAllRead();
            }
        );
        this.notificationService.getUnreadNotifications().take(1).subscribe(unreadNotifications => {
                this.unreadNotifications = unreadNotifications;
            }
        );
    }

    //noinspection JSMethodCanBeStatic
    getNotificationSubject(unreadNotification: Notification) {
        return unreadNotification.subject;
    }


}