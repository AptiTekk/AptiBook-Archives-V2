/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {AuthService} from "../../core/services/auth.service";
import {NotificationService} from "../../core/services/notification.service";
import {Notification} from "../../models/notification.model";

@Component({
    selector: 'at-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit {

    user: User;
    unreadNotifications: Notification[] = [];

    constructor(private router: Router,
                private authService: AuthService,
                private  notificationService: NotificationService) {
    }

    ngOnInit(): void {
        this.authService.getUser().subscribe(user => {
            if (user) {
                this.user = user;
                this.notificationService.getUnreadNotifications().subscribe(unreadNotifications => {
                    this.unreadNotifications = unreadNotifications;
                });
            }
        });
    }

    onSignOut() {
        this.authService.signOut().subscribe(response => this.router.navigate(['', 'sign-in']));
    }

}