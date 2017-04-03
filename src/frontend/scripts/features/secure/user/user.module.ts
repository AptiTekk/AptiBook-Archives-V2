/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { UserComponent } from './user.component';
import {AccountComponent} from "./account/account.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {SharedModule} from "../../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {UserRoutesModule} from "./user.routes";

@NgModule({
    imports: [
        SharedModule,
        UserRoutesModule
    ],
    declarations: [
        UserComponent,
        AccountComponent,
        NotificationsComponent
    ],
    exports: [],
    providers: [],
})
export class UserModule { }
