import {Component} from "@angular/core";
import {UnreadNotification} from "../../../../models/notification.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {NotificationService} from "../../../../services/singleton/notification.service";
import * as moment from "moment";
import Moment = moment.Moment;
import * as Rx from 'rxjs/Rx';
import {ReplaySubject} from "rxjs";
@Component({
    selector: 'my-notifications-page',
    templateUrl: 'notifications-page.component.html'

})
export class NotificationsPageComponent {

    markedRead: boolean = false;

    notifications: UnreadNotification[] = [];
    unreadNotifications: UnreadNotification[] = [];

    //noinspection JSMethodCanBeStatic
    getTimeAgo(unreadNotification: UnreadNotification) {
        if(unreadNotification != undefined && unreadNotification != null)
        return moment(unreadNotification.creation).fromNow();
    }

    constructor(authService: AuthService, notificationService: NotificationService) {
        notificationService.reloadNotifications();
        notificationService.getNotifications().take(1).subscribe(notifications => {
                this.notifications = notifications;
                if (!this.markedRead) {
                    notificationService.markAllRead();
                    this.markedRead = true;
                }
            }
        );
        notificationService.getUnreadNotifications().take(1).subscribe(unreadNotifications => {
                this.unreadNotifications = unreadNotifications;
            }
        );
    }

    //noinspection JSMethodCanBeStatic
    getNotificationSubject(unreadNotification: UnreadNotification) {
        return unreadNotification.subject;
    }


}