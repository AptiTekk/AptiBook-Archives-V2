/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {CommonModule} from "@angular/common";
import {LoaderModule} from "./loader/loader.module";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        LoaderModule
    ],
    declarations: [AppComponent],
    exports: [],
    providers: [],
})
export class AppBootstrapModule {
}
