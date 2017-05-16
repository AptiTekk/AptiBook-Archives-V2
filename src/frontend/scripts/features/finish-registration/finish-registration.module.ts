/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {RegisterRoutesModule} from "./finish-registration.routes";
import {SharedModule} from "../../shared/shared.module";
import {HeaderModule} from "../../app/header/header.module";
import {FinishRegistrationComponent} from "./finish-registration.component";

@NgModule({
    imports: [
        SharedModule,

        HeaderModule,

        RegisterRoutesModule
    ],
    declarations: [FinishRegistrationComponent],
    exports: [],
    providers: [],
})
export class FinishRegistrationModule {
}
