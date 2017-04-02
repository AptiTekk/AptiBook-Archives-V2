/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { SecureComponent } from './secure.component';
import {SharedModule} from "../../components/shared.module";

/**
 * The secure section is off-limits to the users who have not signed in.
 */
@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        SecureComponent
    ],
    exports: [],
    providers: [],
})
export class SecureModule { }
