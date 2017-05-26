/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {SharedModule} from "../../shared/shared.module";
import {HeaderComponent} from "./header.component";

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [HeaderComponent],
    exports: [HeaderComponent],
    providers: [],
})
export class HeaderModule {
}
