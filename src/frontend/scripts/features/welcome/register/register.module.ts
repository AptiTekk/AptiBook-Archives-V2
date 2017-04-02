/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { RegisterComponent } from './register.component';
import {RegisterSuccessComponent} from "./success/register-success.component";
import {SharedModule} from "../../../shared/shared.module";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        RegisterComponent,
        RegisterSuccessComponent
    ],
    exports: [
        RegisterComponent
    ],
    providers: [],
})
export class RegisterModule { }
