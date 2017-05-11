/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "./register.component";
import {RegisterGuard} from "./register.guard";

const routes: Routes = [
    {
        path: '',
        component: RegisterComponent,
        canActivate: [RegisterGuard]
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
        RegisterGuard
    ]
})
export class RegisterRoutesModule {
}