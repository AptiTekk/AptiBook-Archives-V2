/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./page-components/app/app.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import * as components from "./components";
import * as pageComponents from "./page-components";
import {routes} from "./routing/routes";
import * as guards from "./routing/guards";
import * as pipes from "./pipes";
import {vendorComponents, vendorImports} from "./vendors/angular-vendors";
import {AptiBookErrorHandler} from "./error-handler";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CoreModule} from "./core/core.module";

export const mapImports = (obj: Object) => Object.keys(obj).map(key => obj[key]);

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        CoreModule,
        routes,
        BrowserAnimationsModule,
        ...vendorImports
    ],
    declarations: [
        ...mapImports(components),
        ...mapImports(pageComponents),
        ...mapImports(pipes),
        ...vendorComponents
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: AptiBookErrorHandler
        },
        ...mapImports(guards)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}