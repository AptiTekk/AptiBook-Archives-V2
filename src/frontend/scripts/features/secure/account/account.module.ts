/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from '@angular/core';

import {AccountComponent}   from './account.component';
import {SharedModule} from "../../../shared/shared.module";
import {AccountRoutesModule} from "./account.routes";
import {NotificationsComponent} from "./notifications/notifications.component";
import {UpcomingReservationsComponent} from "./reservations/upcoming/upcoming-reservations.component";
import {UserSectionComponent} from "./user-section/user-section.component";
import {AccountNotificationSettingsModule} from "./notifications/notification-settings/notification-settings.module";

@NgModule({
    imports: [
        SharedModule,
        AccountRoutesModule,
        AccountNotificationSettingsModule
    ],
    declarations: [
        AccountComponent,
        UserSectionComponent,
        NotificationsComponent,
        UpcomingReservationsComponent
    ],
    exports: [],
    providers: [],
})
export class AccountModule {
}
