/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {NotificationTogglerComponent} from "./notification-toggler/notification-toggler.component";
import {SharedModule} from "../../../../../shared/shared.module";
import {AccountNotificationSettingsComponent} from "./notification-settings.component";

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        AccountNotificationSettingsComponent,
        NotificationTogglerComponent
    ],
    exports: [
        AccountNotificationSettingsComponent
    ],
    providers: [],
})
export class AccountNotificationSettingsModule {
}
