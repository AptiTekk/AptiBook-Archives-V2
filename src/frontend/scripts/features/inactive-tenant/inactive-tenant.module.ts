/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { InactiveTenantComponent } from './inactive-tenant.component';
import {SharedModule} from "../../shared/shared.module";
import {HeaderModule} from "../../app/header/header.module";
import {FooterModule} from "../../app/footer/footer.module";
import {InactiveTenantRoutesModule} from "./inactive-tenant.routes";

@NgModule({
    imports: [
        SharedModule,
        HeaderModule,
        FooterModule,
        InactiveTenantRoutesModule
    ],
    declarations: [
        InactiveTenantComponent
    ],
    exports: [],
    providers: [],
})
export class InactiveTenantModule { }
