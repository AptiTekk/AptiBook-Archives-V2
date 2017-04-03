/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SecureComponent} from "./secure.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AccountComponent} from "./user/account/account.component";
import {NotificationsComponent} from "./user/notifications/notifications.component";
import {ResourcesConfigurationComponent} from "./configuration/resources/resources.component";
import {UsersConfigurationComponent} from "./configuration/users/users.component";
import {AllUsersComponent} from "./configuration/users/all-users/all-users.component";
import {GroupsComponent} from "./configuration/users/groups/groups.component";
import {PropertiesConfigurationComponent} from "./configuration/properties/properties.component";
import {ManagementComponent} from "./management/management.component";
import {ApprovalQueueComponent} from "./management/approval-queue/approval-queue.component";
import {ApprovedComponent} from "./management/approved/approved.component";
import {RejectedComponent} from "./management/rejected/rejected.component";
import {CalendarComponent} from "./management/calendar/calendar.component";
import {SecureGuard} from "./secure.guard";


const routes: Routes = [
    {
        path: '',
        component: SecureComponent,
        children: [
            {
                path: 'dashboard',
                children: [
                    {
                        path: '',
                        component: DashboardComponent
                    },
                    {
                        path: 'upcoming',
                        component: DashboardComponent //TODO: New component
                    },
                    {
                        path: '**',
                        redirectTo: ''
                    }
                ]
            },
            {
                path: 'search-results',
                loadChildren: './search-results/search-results.module#SearchResultsModule'
            },
            {
                path: 'user',
                loadChildren: './user/user.module#UserModule'
            },
            {
                path: 'configuration',
                loadChildren: './configuration/configuration.module#ConfigurationModule'
            },
            {
                path: 'management',
                loadChildren: './management/management.module#ManagementModule'
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ],
        canActivate: [SecureGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        SecureGuard
    ]
})
export class SecureRoutesModule {
}