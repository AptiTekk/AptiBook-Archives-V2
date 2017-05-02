/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";

import {SecureComponent} from "./secure.component";
import {SharedModule} from "../../shared/shared.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {ManagementModule} from "./management/management.module";
import {SearchResultsModule} from "./search-results/search-results.module";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {FooterModule} from "../../app/footer/footer.module";
import {SecureRoutesModule} from "./secure.routes";
import {ConfigurationModule} from "./configuration/configuration.module";
import {AccountModule} from "./account/account.module";
import {HeaderModule} from "../../app/header/header.module";

/**
 * The secure section is off-limits to the users who have not signed in.
 */
@NgModule({
    imports: [
        SharedModule,
        HeaderModule,

        // Routes
        SecureRoutesModule,

        // Components
        DashboardModule,
        ConfigurationModule,
        ManagementModule,
        SearchResultsModule,
        AccountModule,
        FooterModule
    ],
    declarations: [
        SecureComponent,
        SidebarComponent
    ],
    exports: [],
    providers: [],
})
export class SecureModule {
}
