/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {DashboardComponent} from "./dashboard.component";
import {NewReservationModalComponent} from "./new-reservation-modal/new-reservation-modal.component";
import {SharedModule} from "../../../shared/shared.module";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        DashboardComponent,
        NewReservationModalComponent
    ],
    exports: [],
    providers: [],
})
export class DashboardModule {
}
