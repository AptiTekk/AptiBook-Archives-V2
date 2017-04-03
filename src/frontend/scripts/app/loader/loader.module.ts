/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {LoaderComponent} from "./loader.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        LoaderComponent
    ],
    exports: [
        LoaderComponent
    ],
    providers: [],
})
export class LoaderModule {
}
