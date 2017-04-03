/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {ResourceCategoryFilterPipe} from "./resource-category-filter.pipe";

@NgModule({
    imports: [],
    declarations: [
        ResourceCategoryFilterPipe
    ],
    exports: [
        ResourceCategoryFilterPipe
    ],
    providers: [],
})
export class PipesModule {
}
