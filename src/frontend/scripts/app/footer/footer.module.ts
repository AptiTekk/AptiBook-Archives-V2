/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {FooterComponent} from "./footer.component";
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {HelpModalComponent} from "./help-modal/help-modal.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        FooterComponent,
        HelpModalComponent,
        InfoModalComponent
    ],
    exports: [
        FooterComponent
    ],
    providers: [],
})
export class FooterModule {
}
