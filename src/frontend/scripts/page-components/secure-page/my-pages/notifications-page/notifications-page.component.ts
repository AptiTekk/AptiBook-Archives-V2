import {Component} from "@angular/core";
import {UnreadNotification} from "../../../../models/notification.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {NotificationService} from "../../../../services/singleton/notification.service";
import * as moment from "moment";
import Moment = moment.Moment;
@Component({
    selector: 'my-notifications-page',
    templateUrl: 'notifications-page.component.html'

})
export class NotificationsPageComponent {

    unreadNotification: UnreadNotification[];

    //noinspection JSMethodCanBeStatic
    getTimeAgo(unreadNotification: UnreadNotification){
        let ts = moment(unreadNotification.creation);
        return moment(ts).fromNow();
    }


    constructor(authService: AuthService, notificationService: NotificationService){
        authService.getUser().subscribe(user => {
            if (user != undefined) {
                notificationService.getNotifications(user).subscribe(unreadNotification => {
                        if (unreadNotification != undefined) {
                            this.unreadNotification = unreadNotification;
                                notificationService.markAllRead(user);
                        }
                    }
                );
            }else{
                console.log("User is undefined");
            }
        });
    }
    //noinspection JSMethodCanBeStatic
    getNotificationSubject(unreadNotification: UnreadNotification){
        return unreadNotification.subject;
    }



}