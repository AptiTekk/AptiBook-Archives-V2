/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";
import {User} from "../../models/user.model";
import {Notification} from "../../models/notification.model";
import {AuthService} from "./auth.service";

@Injectable()
export class NotificationService {

    private user: User;
    private notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);
    private unreadNotifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);
    private readNotifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

    constructor(private apiService: APIService, private authService: AuthService) {
        this.authService.getCurrentUser().subscribe(user => {
            if (user != undefined) {
                this.user = user;
                this.reloadNotifications();
            }
        });
    }

    getNotifications(): ReplaySubject<Notification[]> {
        return this.notifications;
    }

    getUnreadNotifications(): ReplaySubject<Notification[]> {
        return this.unreadNotifications;
    }

    getReadNotifications(): ReplaySubject<Notification[]> {
        return this.readNotifications;
    }

    reloadNotifications(): void {
        this.apiService.get("notifications/user/" + this.user.id).subscribe(
            response => {
                let notifications = <Notification[]> response;
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
                let notifications = <Notification[]> response;
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