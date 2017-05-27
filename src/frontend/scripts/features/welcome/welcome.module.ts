/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {WelcomeComponent} from "./welcome.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SharedModule} from "../../shared/shared.module";
import {RegisterModule} from "./register/register.module";
import {FooterModule} from "../../app/footer/footer.module";
import {WelcomeRoutesModule} from "./welcome.routes";
import {AdminSignInComponent} from "./admin/admin-sign-in.component";

/**
 * The welcome section is the page that greets unauthenticated users as they sign in, register, etc.
 */
@NgModule({
    imports: [
        SharedModule,
        WelcomeRoutesModule,
        RegisterModule,
        FooterModule
    ],
    declarations: [
        WelcomeComponent,
        SignInComponent,
        AdminSignInComponent
    ],
    exports: [],
    providers: [],
})
export class WelcomeModule {
}
