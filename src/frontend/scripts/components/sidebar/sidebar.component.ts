/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {NavigationLink} from "../navigation/navigation-link.model";
import {AuthService} from "../../core/services/auth.service";
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {NotificationService} from "../../core/services/notification.service";
import {Notification} from "../../models/notification.model";
import {LoaderService} from "../../core/services/loader.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.css', 'sidebar.mobile.component.css']
})
export class SidebarComponent implements OnInit {

    public reservationManagementLinks: NavigationLink[] = [
        {icon: 'hourglass-half', label: 'Pending', path: ['', 'secure', 'management', 'pending']},
        {icon: 'calendar-check-o', label: 'Approved', path: ['', 'secure', 'management', 'approved']},
        {icon: 'calendar-times-o', label: 'Rejected', path: ['', 'secure', 'management', 'rejected']},
        {icon: 'calendar', label: 'Calendar', path: ['', 'secure', 'management', 'calendar']}
    ];

    public configurationLinks: NavigationLink[] = [
        {icon: 'tags', label: 'Resources', path: ['', 'secure', 'configuration', 'resources']},
        {icon: 'user', label: 'Users', path: ['', 'secure', 'configuration', 'users']},
        {icon: 'unlock', label: 'Permissions', path: ['', 'secure', 'configuration', 'permissions']},
        {icon: 'cog', label: 'Properties', path: ['', 'secure', 'configuration', 'properties']}
    ];

    public myLinks: NavigationLink[] = [
        {icon: 'pencil', label: 'My Account', path: ['', 'secure', 'my', 'account']},
        {icon: 'bell', label: 'My Notifications', path: ['', 'secure', 'my', 'notifications']}
    ];

    /**
     * The currently signed in user.
     */
    private user: User;

    //noinspection JSMismatchedCollectionQueryUpdate
    /**
     * Contains the currently signed in user's unread notifications.
     */
    private unreadNotifications: Notification[] = [];

    /**
     * This variable keeps track of when the user swipes the sidebar open or closed (on mobile devices)
     */
    private swipedOpen: boolean = false;

    constructor(private authService: AuthService,
                private notificationService: NotificationService,
                private loaderService: LoaderService,
                private router: Router) {
    }

    ngOnInit(): void {

        // Get the user and their unread notifications
        this.authService.getUser().subscribe(user => {
            if (user) {
                this.user = user;
                this.notificationService.getUnreadNotifications().subscribe(unreadNotifications => {
                    this.unreadNotifications = unreadNotifications;
                });
            }
        });
    }

    onSwipeRight() {
        this.swipedOpen = true;
    }

    onSwipeLeft() {
        this.swipedOpen = false;
    }

    onSignOut() {
        this.loaderService.startLoading();
        this.authService.signOut().subscribe(
            success => {
                this.loaderService.stopLoading();
                this.router.navigate(['', 'sign-in']);
            }
        );
    }
}