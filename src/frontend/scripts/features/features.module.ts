/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {WelcomeModule} from "./welcome/welcome.module";
import {SharedModule} from "../shared/shared.module";
import {SecureModule} from "./secure/secure.module";
import {CommonModule} from "@angular/common";
import {InactiveTenantModule} from "./inactive-tenant/inactive-tenant.module";

/**
 * This module groups together modules and components which are part of larger "features."
 * These modules and components aren't meant to be re-used. Examples are pages, sections of pages, specific modals, etc.
 */
@NgModule({
    imports: [
        CommonModule,
        SharedModule,

        // The order of these modules is important, as it determines route rule testing order.
        SecureModule,
        InactiveTenantModule,
        WelcomeModule
    ],
    declarations: [],
    exports: [],
    providers: [],
})
export class FeaturesModule {
}
