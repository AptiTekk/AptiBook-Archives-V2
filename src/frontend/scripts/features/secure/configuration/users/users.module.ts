/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { UsersConfigurationComponent } from './users.component';
import {SharedModule} from "../../../../shared/shared.module";
import {AllUsersModule} from "./all-users/all-users.module";
import {GroupsModule} from "./groups/groups.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        SharedModule,
        AllUsersModule,
        GroupsModule
    ],
    declarations: [
        UsersConfigurationComponent
    ],
    exports: [],
    providers: [],
})
export class UsersConfigurationModule { }
