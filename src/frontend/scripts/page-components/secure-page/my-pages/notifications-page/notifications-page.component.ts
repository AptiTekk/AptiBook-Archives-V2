import {Component} from "@angular/core";
import {Notification} from "../../../../models/notification.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {NotificationService} from "../../../../services/singleton/notification.service";
import * as moment from "moment";
import Moment = moment.Moment;
@Component({
    selector: 'my-notifications-page',
    templateUrl: 'notifications-page.component.html',
    styleUrls: ['notifications-page.component.css']
})
export class NotificationsPageComponent {

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