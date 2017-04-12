/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {CurrentUserService} from "../../../../../core/services/current-user.service";
import {NotificationSettings} from "../../../../../models/notification-settings.model";

@Component({
    selector: 'at-user-account-notification-settings',
    templateUrl: 'notification-settings.component.html'
})
export class AccountNotificationSettingsComponent implements OnInit {

    notificationSettings: NotificationSettings;

    constructor(private currentUserService: CurrentUserService) {

    }

    ngOnInit() {
        // Subscribe to notification settings changes
        this.currentUserService.getNotificationSettings()
            .subscribe(
                notificationSettings => this.notificationSettings = notificationSettings
            );
    }

}