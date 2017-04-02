/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';
import {FileSelectDirective, FileDropDirective} from "ng2-file-upload";

@NgModule({
    imports: [],
    declarations: [
        FileSelectDirective,
        FileDropDirective
    ],
    exports: [
        FileSelectDirective,
        FileDropDirective
    ],
    providers: [],
})
export class VendorsModule { }
