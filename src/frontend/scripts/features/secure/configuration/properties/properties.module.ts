/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {PropertiesConfigurationComponent} from "./properties.component";
import {PropertiesConfirmModalComponent} from "./properties-confirm-modal/properties-confirm.modal.component";
import {SharedModule} from "../../../../shared/shared.module";
import {PropertiesSectionComponent} from "./properties-section/properties-section.component";
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        PropertiesConfigurationComponent,
        PropertiesConfirmModalComponent,
        PropertiesSectionComponent
    ],
    exports: [],
    providers: [],
})
export class PropertiesConfigurationModule {
}
