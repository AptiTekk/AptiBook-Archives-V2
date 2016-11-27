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
                            this.unreadNotification = unreadNotification;
                            console.log("here");
                             notificationService.markAllRead(user).subscribe(response => response);
                    }
                );

            }else{
                console.log("User is undefined asdfasdf");
            }
        });
    }
    //noinspection JSMethodCanBeStatic
    getNotificationSubject(unreadNotification: UnreadNotification){
        return unreadNotification.subject;
    }



}