/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {CurrentUserService} from "../../../../../core/services/current-user.service";
import {NotificationSettings} from "../../../../../models/notification-settings.model";
import {User} from "../../../../../models/user.model";
import {AlertComponent} from "../../../../../shared/alert/alert.component";

@Component({
    selector: 'at-account-notification-settings',
    templateUrl: 'notification-settings.component.html',
    styleUrls: ['notification-settings.component.css']
})
export class AccountNotificationSettingsComponent implements OnInit {

    @ViewChild('infoAlert') infoAlert: AlertComponent;
    @ViewChild('dangerAlert') dangerAlert: AlertComponent;

    currentUser: User;

    notificationSettings: NotificationSettings;

    constructor(private currentUserService: CurrentUserService) {

    }

    ngOnInit() {
        // Subscribe to the current user.
        this.currentUserService.getCurrentUser()
            .subscribe(
                user => this.currentUser = user
            );

        // Subscribe to notification settings changes
        this.currentUserService.getNotificationSettings()
            .subscribe(
                notificationSettings => this.notificationSettings = notificationSettings
            );
    }

    /**
     * Saves a setting to the server by its name.
     * @param setting The name of the setting to save.
     */
    saveSetting(setting: string): void {
        this.currentUserService.patchNotificationSetting(setting, this.notificationSettings[setting])
            .subscribe(
                response => {
                    this.currentUserService.fetchNotificationSettings();
                    this.infoAlert.display("Notification Preferences Updated!");
                },
                err => {
                    this.dangerAlert.display(err, false);
                }
            );
    }

}