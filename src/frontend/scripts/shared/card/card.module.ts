/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {CardComponent} from "./card.component";
import {CardBlockComponent} from "./card-block/card-block.component";
import {CardFooterComponent} from "./card-footer/card-footer.component";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CardComponent,
        CardBlockComponent,
        CardFooterComponent
    ],
    exports: [
        CardComponent,
        CardBlockComponent,
        CardFooterComponent
    ],
    providers: [],
})
export class CardModule {
}
