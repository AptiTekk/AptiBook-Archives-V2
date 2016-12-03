import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, Notification} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import {UnreadNotification} from "../../models/notification.model";
import * as moment from 'moment';
import {ReplaySubject} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable()
export class NotificationService {

    private user: User;
    private notifications: ReplaySubject<UnreadNotification[]> = new ReplaySubject<UnreadNotification[]>(1);
    private unreadNotifications: ReplaySubject<UnreadNotification[]> = new ReplaySubject<UnreadNotification[]>(1);
    private readNotifications: ReplaySubject<UnreadNotification[]> = new ReplaySubject<UnreadNotification[]>(1);

    constructor(private apiService: APIService, private authService: AuthService) {
        this.authService.getUser().subscribe(user => {
            if (user != undefined) {
                this.user = user;
                this.reloadNotifications();
            }
        });
    }

    getNotifications(): ReplaySubject<UnreadNotification[]> {
        return this.notifications;
    }

    getUnreadNotifications(): ReplaySubject<UnreadNotification[]> {
        return this.unreadNotifications;
    }

    getReadNotifications(): ReplaySubject<UnreadNotification[]> {
        return this.readNotifications;
    }

    reloadNotifications(): void {
        this.apiService.get("notifications/user/" + this.user.id).subscribe(
            response => {
                let notifications = <UnreadNotification[]> response;
                this.notifications.next(notifications);
                this.unreadNotifications.next(notifications.filter(n => !n.read));
                this.readNotifications.next(notifications.filter(n => n.read));
            },
            err => {
                this.notifications.next([]);
                this.unreadNotifications.next([]);
                this.readNotifications.next([]);
            }
        )
    }

    public markAllRead(): void {
        this.apiService.patch("notifications/user/" + this.user.id + "/markRead").subscribe(
            response => {
                let notifications = <UnreadNotification[]> response;
                this.notifications.next(notifications);
                this.unreadNotifications.next(notifications.filter(n => !n.read));
                this.readNotifications.next(notifications.filter(n => n.read));
            },
            err => {
                this.notifications.next([]);
                this.unreadNotifications.next([]);
                this.readNotifications.next([]);
            }
        );
    }

}