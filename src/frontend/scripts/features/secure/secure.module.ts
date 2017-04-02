/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { SecureComponent } from './secure.component';
import {SharedModule} from "../../shared/shared.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {ManagementModule} from "./management/management.module";
import {SearchResultsModule} from "./search-results/search.module";
import {CommonModule} from "@angular/common";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {FooterModule} from "../../app/footer/footer.module";
import {SecureRoutesModule} from "./secure.routes";
import {UserModule} from "./user/user.module";
import {ConfigurationModule} from "./configuration/configuration.module";

/**
 * The secure section is off-limits to the users who have not signed in.
 */
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SecureRoutesModule,
        DashboardModule,
        ConfigurationModule,
        ManagementModule,
        SearchResultsModule,
        UserModule,
        FooterModule
    ],
    declarations: [
        SecureComponent,
        SidebarComponent
    ],
    exports: [],
    providers: [],
})
export class SecureModule { }
