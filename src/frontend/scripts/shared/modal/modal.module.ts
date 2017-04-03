/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {ModalComponent} from "./modal.component";
import {ModalBodyComponent} from "./modal-body/modal-body.component";
import {ModalFooterComponent} from "./modal-footer/modal-footer.component";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ModalComponent,
        ModalBodyComponent,
        ModalFooterComponent
    ],
    exports: [
        ModalComponent,
        ModalBodyComponent,
        ModalFooterComponent
    ],
    providers: [],
})
export class ModalModule {
}
