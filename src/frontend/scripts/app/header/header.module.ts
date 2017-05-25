/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {SharedModule} from "../../shared/shared.module";
import {HeaderComponent} from "./header.component";
import {Angulartics2Module} from "angulartics2/dist";

@NgModule({
    imports: [
        Angulartics2Module.forChild(),
        SharedModule
    ],
    declarations: [HeaderComponent],
    exports: [HeaderComponent],
    providers: [],
})
export class HeaderModule {
}
