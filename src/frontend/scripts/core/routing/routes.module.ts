/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WelcomeGuard} from "./guards/welcome.guard";
import {RegisterSuccessComponent} from "../../page-components/welcome/register/success/register-success.component";
import {RegisterComponent} from "../../page-components/welcome/register/register.component";
import {SignInComponent} from "../../page-components/welcome/sign-in/sign-in.component";
import {WelcomeComponent} from "../../page-components/welcome/welcome.component";
import {InactiveTenantComponent} from "../../page-components/inactive-tenant/inactive-tenant.component";
import {SecureGuard} from "./guards/secure.guard";
import {CalendarPageComponent} from "../../page-components/secure/management/calendar-page/calendar-page.component";
import {RejectedPageComponent} from "../../page-components/secure/management/rejected-page/rejected-page.component";
import {ApprovedPageComponent} from "../../page-components/secure/management/approved-page/approved-page.component";
import {ApprovalQueuePageComponent} from "../../page-components/secure/management/approval-queue-page/approval-queue-page.component";
import {ManagementContainerComponent} from "../../page-components/secure/management/management-container.component";
import {PropertiesPageComponent} from "../../page-components/secure/configuration/properties/properties-page.component";
import {GroupsComponent} from "../../page-components/secure/configuration/users/groups/groups.component";
import {AllUsersComponent} from "../../page-components/secure/configuration/users/all-users/all-users.component";
import {UsersConfigurationComponent} from "../../page-components/secure/configuration/users/users.component";
import {ResourcesPageComponent} from "../../page-components/secure/configuration/resources/resources-page.component";
import {NotificationsPageComponent} from "../../page-components/secure/user/notifications/notifications-page.component";
import {AccountPageComponent} from "../../page-components/secure/user/account/account-page.component";
import {SuccessPageComponent} from "../../page-components/secure/search-results/success-page/success-page.component";
import {ReservationDetailsComponent} from "../../page-components/secure/search-results/reservation-details-page/reservation-details-page.component";
import {SearchResultsPageComponent} from "../../page-components/secure/search-results/search-results-page.component";
import {SearchGuard} from "./guards/search.guard";
import {DashboardPageComponent} from "../../page-components/secure/dashboard/dashboard-page.component";
import {SecureComponent} from "../../page-components/secure/secure.component";
import {GuardsModule} from "./guards/guards.module";

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
                        component: DashboardPageComponent
                    },
                    {
                        path: 'upcoming',
                        component: DashboardPageComponent //TODO: New component
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
                        component: SuccessPageComponent
                    },
                    {
                        path: '**',
                        component: SearchResultsPageComponent
                    }
                ]
            },
            {
                path: 'my',
                children: [
                    {
                        path: 'account',
                        component: AccountPageComponent
                    },
                    {
                        path: 'notifications',
                        component: NotificationsPageComponent
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
                        component: ResourcesPageComponent
                    },
                    {
                        path: 'resources/:resourceCategory',
                        component: ResourcesPageComponent,
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
                        component: PropertiesPageComponent,
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
                component: ManagementContainerComponent,
                children: [
                    {
                        path: 'queue',
                        component: ApprovalQueuePageComponent
                    },
                    {
                        path: 'approved',
                        component: ApprovedPageComponent
                    },
                    {
                        path: 'rejected',
                        component: RejectedPageComponent
                    },
                    {
                        path: 'calendar',
                        component: CalendarPageComponent
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
    },
    {
        path: 'inactive',
        component: InactiveTenantComponent
    },
    {
        path: '',
        component: WelcomeComponent,
        children: [
            {
                path: 'sign-in',
                component: SignInComponent
            },
            {
                path: 'register',
                component: RegisterComponent,
            },
            {
                path: 'register/success',
                component: RegisterSuccessComponent
            },
            {
                path: '**',
                redirectTo: 'sign-in'
            }
        ],
        canActivate: [WelcomeGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        GuardsModule
    ],
    exports: [RouterModule],
})
export class RoutesModule {
}