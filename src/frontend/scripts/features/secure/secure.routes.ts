/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SecureComponent} from "./secure.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {SearchGuard} from "./search.guard";
import {ReservationDetailsComponent} from "./search-results/reservation-details/reservation-details.component";
import {SuccessComponent} from "./search-results/success/success.component";
import {SearchResultsComponent} from "./search-results/search-results.component";
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
        path: 'secure',
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
                canActivate: [SearchGuard],
                children: [
                    {
                        path: 'reservation-details',
                        component: ReservationDetailsComponent
                    },
                    {
                        path: 'success',
                        component: SuccessComponent
                    },
                    {
                        path: '**',
                        component: SearchResultsComponent
                    }
                ]
            },
            {
                path: 'my',
                children: [
                    {
                        path: 'account',
                        component: AccountComponent
                    },
                    {
                        path: 'notifications',
                        component: NotificationsComponent
                    },
                    {
                        path: '**',
                        redirectTo: 'account'
                    }
                ]
            },
            {
                path: 'configuration',
                children: [
                    {
                        path: 'resources',
                        component: ResourcesConfigurationComponent
                    },
                    {
                        path: 'resources/:resourceCategory',
                        component: ResourcesConfigurationComponent,
                    },
                    {
                        path: 'users',
                        component: UsersConfigurationComponent,
                        children: [
                            {
                                path: '',
                                component: AllUsersComponent
                            },
                            {
                                path: 'groups',
                                component: GroupsComponent
                            },
                            {
                                path: '**',
                                redirectTo: ''
                            }
                        ]
                    },
                    {
                        path: 'properties/:section',
                        component: PropertiesConfigurationComponent,
                    },
                    {
                        path: 'properties',
                        redirectTo: 'properties/personalization'
                    },
                    {
                        path: '**',
                        redirectTo: 'resources'
                    }
                ]
            },
            {
                path: 'management',
                component: ManagementComponent,
                children: [
                    {
                        path: 'queue',
                        component: ApprovalQueueComponent
                    },
                    {
                        path: 'approved',
                        component: ApprovedComponent
                    },
                    {
                        path: 'rejected',
                        component: RejectedComponent
                    },
                    {
                        path: 'calendar',
                        component: CalendarComponent
                    },
                    {
                        path: '**',
                        redirectTo: 'pending'
                    }
                ]
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
        SecureGuard,
        SearchGuard
    ]
})
export class SecureRoutesModule {
}