/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { FooterComponent } from './footer.component';
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {HelpModalComponent} from "./help-modal/help-modal.component";

@NgModule({
    imports: [

    ],
    declarations: [
        FooterComponent,
        HelpModalComponent,
        InfoModalComponent
    ],
    exports: [

    ],
    providers: [

    ],
})
export class FooterModule { }
