/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {SearchResultsComponent} from "./search-results.component";
import {SharedModule} from "../../../shared/shared.module";
import {ReservationDetailsComponent} from "./reservation-details/reservation-details.component";
import {SuccessComponent} from "./success/success.component";
import {CommonModule} from "@angular/common";
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
    imports: [
        SharedModule,
        PipesModule
    ],
    declarations: [
        SearchResultsComponent,
        ReservationDetailsComponent,
        SuccessComponent
    ],
    exports: [],
    providers: [],
})
export class SearchResultsModule {
}
