/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {PermissionsConfigurationComponent} from "./permissions.component";
import {SharedModule} from "../../../../shared/shared.module";

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        PermissionsConfigurationComponent
    ],
    exports: [],
    providers: [],
})
export class PermissionsConfigurationModule {
}
