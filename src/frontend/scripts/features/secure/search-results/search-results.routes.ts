/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SearchResultsComponent} from "./search-results.component";
import {SuccessComponent} from "./success/success.component";
import {ReservationDetailsComponent} from "./reservation-details/reservation-details.component";
import {SearchResultsGuard} from "./search-results.guard";


const routes: Routes = [
    {
        path: '',
        canActivate: [SearchResultsGuard],
        children: [
            {
                path: 'reservation-details',
                component: ReservationDetailsComponent
            },
            {
                path: 'success',
                component: SuccessComponent
            },
            {
                path: '**',
                component: SearchResultsComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        SearchResultsGuard
    ]
})
export class SearchResultsRoutesModule {
}