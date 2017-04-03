/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';
import {FileUploadModule} from "ng2-file-upload";
import {ImageUploaderComponent} from "./image-uploader.component";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        FileUploadModule
    ],
    declarations: [
        ImageUploaderComponent
    ],
    exports: [
        ImageUploaderComponent
    ],
    providers: [],
})
export class ImageUploaderModule { }
