/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { RegisterComponent } from './register.component';
import {RegisterSuccessComponent} from "./success/register-success.component";
import {SharedModule} from "../../../components/shared.module";

@NgModule({
    imports: [
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
