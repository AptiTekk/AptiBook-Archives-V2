/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {HelpModalComponent} from "./help-modal.component";
import {Angulartics2Module} from "angulartics2";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        Angulartics2Module.forChild(),
        SharedModule
    ],
    declarations: [HelpModalComponent],
    exports: [HelpModalComponent],
    providers: [],
})
export class HelpModalModule {
}
