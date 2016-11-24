import {Component} from "@angular/core";
import {UnreadNotification} from "../../../../models/notification.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {NotificationService} from "../../../../services/singleton/notification.service";


@Component({
    selector: 'my-notifications-page',
    templateUrl: 'notifications-page.component.html'
})
export class NotificationsPageComponent {

    unreadNotification: UnreadNotification[];

    constructor(authService: AuthService, notificationService: NotificationService){
        authService.getUser().subscribe(user => {
            if (user != undefined) {
                notificationService.getNotifications(user).subscribe(unreadNotification => this.unreadNotification = unreadNotification);
                console.log("Got here ");
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