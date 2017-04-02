/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {WelcomeComponent} from "./welcome.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SharedModule} from "../../components/shared.module";
import {RegisterModule} from "./register/register.module";

/**
 * The welcome section is the page that greets unauthenticated users as they sign in, register, etc.
 */
@NgModule({
    imports: [
        SharedModule,
        RegisterModule
    ],
    declarations: [
        WelcomeComponent,
        SignInComponent
    ],
    exports: [],
    providers: [],
})
export class WelcomeModule {
}
