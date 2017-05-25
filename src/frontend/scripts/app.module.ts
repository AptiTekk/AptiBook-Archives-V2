/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {CoreModule} from "./core/core.module";
import {FeaturesModule} from "./features/features.module";
import {AppRoutesModule} from "./app.routes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppBootstrapModule} from "./app/app-bootstrap.module";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutesModule,
        FeaturesModule,
        CoreModule,

        AppBootstrapModule
    ],
    declarations: [],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}