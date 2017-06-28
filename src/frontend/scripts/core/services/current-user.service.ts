/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {User} from "../../models/user.model";
import {NotificationSettings} from "../../models/notification-settings.model";
import {NotificationToggles} from "../../models/notification-toggles.model";

/**
 * Provides details on the currently signed in user.
 */
@Injectable()
export class CurrentUserService {

    /**
     * Emits the currently signed in user, or null if one is not signed in.
     */
    private currentUser = new ReplaySubject<User>(1);

    /**
     * Emits the notification settings of the currently signed in user, or a null object if a user is not signed in.
     */
    private notificationSettings = new ReplaySubject<NotificationSettings>(1);

    constructor(private authService: AuthService,
                private apiService: APIService) {

        // Subscribe for changes to the current user from the AuthService.
        this.authService.getCurrentUser()
            .subscribe(
                user => {
                    this.currentUser.next(user);
                    this.fetchNotificationSettings();
                }
            )
    }

    /**
     * Gets a ReplaySubject that emits the current user if one is signed in, or null if one is not signed in.
     */
    public getCurrentUser(): ReplaySubject<User> {
        return this.currentUser;
    }

    /**
     * Fetches the current user's notification settings from the server.
     */
    public fetchNotificationSettings(): void {
        this.apiService.get("/users/current/notifications/settings")
            .then(response => this.notificationSettings.next(response))
            .catch(err => this.notificationSettings.next(null));
    }

    /**
     * Gets a ReplaySubject which emits the notification settings of the currently signed in user, or a null object
     * if the user is not signed in.
     */
    public getNotificationSettings(): ReplaySubject<NotificationSettings> {
        return this.notificationSettings;
    }

    /**
     * Patches a NotificationToggles for the current user.
     * @param notificationSetting The name of the setting.
     * @param notificationToggles The toggles for the setting.
     * @returns An observable that emits the patched version of the setting upon success, or an error upon failure.
     */
    public patchNotificationSetting(notificationSetting: string, notificationToggles: NotificationToggles): Promise<NotificationToggles> {
        return this.apiService.patch("/users/current/notifications/settings/" + notificationSetting, notificationToggles);
    }

}