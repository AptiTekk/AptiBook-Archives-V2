/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {ResourcesConfigurationComponent} from "./resources.component";
import {EditCategoryModalComponent} from "./edit-category-modal/edit-category-modal.component";
import {EditResourceModalComponent} from "./edit-resource-modal/edit-resource-modal.component";
import {NewCategoryModalComponent} from "./new-category-modal/new-category-modal.component";
import {NewResourceModalComponent} from "./new-resource-modal/new-resource-modal.component";
import {SharedModule} from "../../../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Angulartics2Module} from "angulartics2";

@NgModule({
    imports: [
        Angulartics2Module.forChild(),

        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        ResourcesConfigurationComponent,
        EditCategoryModalComponent,
        EditResourceModalComponent,
        NewCategoryModalComponent,
        NewResourceModalComponent
    ],
    exports: [],
    providers: [],
})
export class ResourcesConfigurationModule {
}
