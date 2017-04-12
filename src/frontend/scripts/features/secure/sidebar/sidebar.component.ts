/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
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

    /**
     * Determines if the current User has any of the given permissions.
     * @param descriptors The descriptors of the permissions to check for.
     * @returns true if the user has permission (admin always returns true,
     * and users with full permissions return true).
     */
    hasPermission(descriptors: string[]): boolean {
        // Check for admin status
        if (this.user != null && this.user.admin)
            return true;

        // Filter for full permissions or the given permission.
        return this.userPermissions
                .filter(permission => permission.descriptor === 'GENERAL_FULL_PERMISSIONS'
                || descriptors.includes(permission.descriptor))
                .length > 0;
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