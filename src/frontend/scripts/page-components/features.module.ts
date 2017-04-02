/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {WelcomeModule} from "./welcome/welcome.module";
import {InactiveTenantComponent} from "./inactive-tenant/inactive-tenant.component";
import {SharedModule} from "../components/shared.module";
import {SecureModule} from "./secure/secure.module";

/**
 * This module groups together modules and components which are part of larger "features."
 * These modules and components aren't meant to be re-used. Examples are pages, sections of pages, specific modals, etc.
 */
@NgModule({
    imports: [
        SharedModule,
        WelcomeModule,
        SecureModule
    ],
    declarations: [
        InactiveTenantComponent
    ],
    exports: [],
    providers: [],
})
export class FeaturesModule {
}
