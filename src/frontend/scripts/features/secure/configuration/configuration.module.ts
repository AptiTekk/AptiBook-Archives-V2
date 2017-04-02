/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {ConfigurationComponent} from "./configuration.component";
import {UsersConfigurationModule} from "./users/users.module";
import {ResourcesConfigurationModule} from "./resources/resources.module";
import {PropertiesConfigurationModule} from "./properties/properties.module";
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
    imports: [
        SharedModule,
        ResourcesConfigurationModule,
        PropertiesConfigurationModule,
        UsersConfigurationModule
    ],
    declarations: [
        ConfigurationComponent
    ],
    exports: [],
    providers: [],
})
export class ConfigurationModule {
}
