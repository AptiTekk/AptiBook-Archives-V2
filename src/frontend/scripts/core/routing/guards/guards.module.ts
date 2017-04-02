/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {WelcomeGuard} from "./welcome.guard";
import {SecureGuard} from "./secure.guard";
import {SearchGuard} from "./search.guard";

@NgModule({
    imports: [],
    declarations: [],
    exports: [],
    providers: [
        WelcomeGuard,
        SecureGuard,
        SearchGuard
    ],
})
export class GuardsModule {
}
