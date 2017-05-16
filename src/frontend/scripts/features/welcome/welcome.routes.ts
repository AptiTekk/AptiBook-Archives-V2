/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WelcomeComponent} from "./welcome.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {RegisterComponent} from "./register/register.component";
import {RegisterSuccessComponent} from "./register/success/register-success.component";
import {AdminSignInComponent} from "./admin/admin-sign-in.component";
import {SignInGuard} from "./sign-in/sign-in.guard";
import {WelcomeGuard} from "./welcome.guard";

const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent,
        canActivate: [WelcomeGuard],
        children: [
            {
                path: 'sign-in',
                component: SignInComponent,
                canActivate: [SignInGuard]
            },
            {
                path: 'admin',
                redirectTo: 'sign-in/admin'
            },
            {
                path: 'sign-in/admin',
                component: AdminSignInComponent
            },
            {
                path: 'register',
                component: RegisterComponent,
            },
            {
                path: 'register/success',
                component: RegisterSuccessComponent
            },
            {
                path: '**',
                redirectTo: 'sign-in'
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
        WelcomeGuard,
        SignInGuard
    ]
})
export class WelcomeRoutesModule {
}