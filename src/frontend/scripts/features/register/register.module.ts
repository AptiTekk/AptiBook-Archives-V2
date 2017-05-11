/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {RegisterComponent} from "./register.component";
import {RegisterRoutesModule} from "./register.routes";
import {SharedModule} from "../../shared/shared.module";
import {HeaderModule} from "../../app/header/header.module";

@NgModule({
    imports: [
        SharedModule,

        HeaderModule,

        RegisterRoutesModule
    ],
    declarations: [RegisterComponent],
    exports: [],
    providers: [],
})
export class RegisterModule {
}
