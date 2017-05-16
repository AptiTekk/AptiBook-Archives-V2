/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {FinishRegistrationComponent} from "./finish-registration.component";
import {FinishRegistrationGuard} from "./finish-registration.guard";

const routes: Routes = [
    {
        path: '',
        component: FinishRegistrationComponent,
        canActivate: [FinishRegistrationGuard]
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
        FinishRegistrationGuard
    ]
})
export class RegisterRoutesModule {
}