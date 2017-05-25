/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {FooterComponent} from "./footer.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {Angulartics2Module} from "angulartics2";
import {HelpModalModule} from "../help-modal/help-modal.module";
import {InfoModalModule} from "../info-modal/info-modal.module";

@NgModule({
    imports: [
        Angulartics2Module.forChild(),

        CommonModule,
        SharedModule,

        HelpModalModule,
        InfoModalModule
    ],
    declarations: [
        FooterComponent,
    ],
    exports: [
        FooterComponent
    ],
    providers: [],
})
export class FooterModule {
}
