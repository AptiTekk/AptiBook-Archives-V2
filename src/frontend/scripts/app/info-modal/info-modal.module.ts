/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {Angulartics2Module} from "angulartics2";
import {SharedModule} from "../../shared/shared.module";
import {InfoModalComponent} from "./info-modal.component";

@NgModule({
    imports: [
        Angulartics2Module.forChild(),

        SharedModule
    ],
    declarations: [InfoModalComponent],
    exports: [InfoModalComponent],
    providers: [],
})
export class InfoModalModule {
}
