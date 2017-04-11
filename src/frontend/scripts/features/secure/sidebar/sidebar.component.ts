/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationLink} from "../../../shared/navigation/navigation-link.model";
import {User} from "../../../models/user.model";
import {Notification} from "../../../models/notification.model";
import {AuthService} from "../../../core/services/auth.service";
import {NotificationService} from "../../../core/services/notification.service";
import {LoaderService} from "../../../core/services/loader.service";
import {PermissionsService} from "../../../core/services/permissions.server";
import {Permission} from "../../../models/permission.model";

@Component({
    selector: 'at-sidebar',
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
        {icon: 'pencil', label: 'My Account', path: ['', 'secure', 'user', 'account']},
        {icon: 'bell', label: 'My Notifications', path: ['', 'secure', 'user', 'notifications']}
    ];

    /**
     * The currently signed in user.
     */
    user: User;

    /**
     * The permissions for the currently signed in user.
     */
    userPermissions: Permission[] = [];

    //noinspection JSMismatchedCollectionQueryUpdate
    /**
     * Contains the currently signed in user's unread notifications.
     */
    unreadNotifications: Notification[] = [];

    /**
     * This variable keeps track of when the user swipes the sidebar open or closed (on mobile devices)
     */
    swipedOpen: boolean = false;

    constructor(private authService: AuthService,
                private permissionsService: PermissionsService,
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

        // Get the user's permissions
        this.permissionsService.getCurrentUserPermissions().subscribe(
            permissions => this.userPermissions = permissions
        )
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