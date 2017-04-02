/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { ConfigurationComponent } from './configuration.component';
import {UsersConfigurationModule} from "./users/users.module";

@NgModule({
    imports: [
        UsersConfigurationModule
    ],
    declarations: [
        ConfigurationComponent
    ],
    exports: [],
    providers: [],
})
export class ConfigurationModule { }
