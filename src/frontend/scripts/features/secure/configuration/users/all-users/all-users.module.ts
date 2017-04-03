/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { AllUsersComponent } from './all-users.component';
import {SharedModule} from "../../../../../shared/shared.module";
import {NewUserModalComponent} from "./new-user-modal/new-user-modal.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        AllUsersComponent,
        NewUserModalComponent
    ],
    exports: [],
    providers: [],
})
export class AllUsersModule { }
