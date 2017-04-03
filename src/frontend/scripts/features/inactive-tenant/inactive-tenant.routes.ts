/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {InactiveTenantComponent} from "./inactive-tenant.component";

const routes: Routes = [
    {
        path: '',
        component: InactiveTenantComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InactiveTenantRoutesModule {
}