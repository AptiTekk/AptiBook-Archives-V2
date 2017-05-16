/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
    {
        path: 'secure',
        loadChildren: './features/secure/secure.module#SecureModule'
    },
    {
        path: 'inactive',
        loadChildren: './features/inactive-tenant/inactive-tenant.module#InactiveTenantModule'
    },
    {
        path: 'finish-registration',
        loadChildren: './features/finish-registration/finish-registration.module#FinishRegistrationModule'
    },
    {
        path: '',
        loadChildren: './features/welcome/welcome.module#WelcomeModule'
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

/**
 * The root routing module. Other routes can be found next to their respective features.
 */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutesModule {
}