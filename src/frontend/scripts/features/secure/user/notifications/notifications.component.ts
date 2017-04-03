/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {Notification} from "../../../../models/notification.model";
import {AuthService} from "../../../../core/services/auth.service";
import {NotificationService} from "../../../../core/services/notification.service";
import * as moment from "moment";
import Moment = moment.Moment;
@Component({
    selector: 'at-user-notifications',
    templateUrl: 'notifications.component.html',
    styleUrls: ['notifications.component.css']
})
export class NotificationsComponent {

    notifications: Notification[] = [];
    unreadNotifications: Notification[] = [];

    //noinspection JSMethodCanBeStatic
    getTimeAgo(unreadNotification: Notification) {
        if (unreadNotification != undefined && unreadNotification != null)
            return moment(unreadNotification.creation).fromNow();
    }

    constructor(authService: AuthService, notificationService: NotificationService) {
        notificationService.reloadNotifications();
        notificationService.getNotifications().take(1).subscribe(notifications => {
                this.notifications = notifications;
                notificationService.markAllRead();
            }
        );
        notificationService.getUnreadNotifications().take(1).subscribe(unreadNotifications => {
                this.unreadNotifications = unreadNotifications;
            }
        );
    }

    //noinspection JSMethodCanBeStatic
    getNotificationSubject(unreadNotification: Notification) {
        return unreadNotification.subject;
    }


}