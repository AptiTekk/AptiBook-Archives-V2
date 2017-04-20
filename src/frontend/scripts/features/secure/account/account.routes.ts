/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AccountComponent} from "./account.component";
import {AccountNotificationsComponent} from "./notifications/notifications.component";
import {UpcomingReservationsComponent} from "./reservations/upcoming/upcoming-reservations.component";
import {AccountNotificationSettingsComponent} from "./notifications/notification-settings/notification-settings.component";

const routes: Routes = [
    {
        path: '',
        component: AccountComponent,
        children: [
            {
                path: '',
                component: UpcomingReservationsComponent
            },
            {
                path: 'notifications',
                component: AccountNotificationsComponent
            },
            {
                path: 'notifications/settings',
                component: AccountNotificationSettingsComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutesModule {
}