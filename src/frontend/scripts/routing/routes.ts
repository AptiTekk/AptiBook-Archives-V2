/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {
    FrontPageComponent,
    SignInComponent,
    RegisterComponent,
    SecurePageComponent,
    DashboardPageComponent,
    AccountPageComponent,
    NotificationsPageComponent
} from "../page-components";
import {FrontPageGuard, SecureGuard} from "./guards";
import {SearchResultsPageComponent} from "../page-components/secure-page/search-results-page/search-results-page.component";
import {SearchGuard} from "./guards/search.guard";
import {CalendarPageComponent} from "../page-components/secure-page/management-pages/calendar-page/calendar-page.component";
import {ApprovalQueuePageComponent} from "../page-components/secure-page/management-pages/approval-queue-page/approval-queue-page.component";
import {ApprovedPageComponent} from "../page-components/secure-page/management-pages/approved-page/approved-page.component";
import {RejectedPageComponent} from "../page-components/secure-page/management-pages/rejected-page/rejected-page.component";
import {ManagementContainerComponent} from "../page-components/secure-page/management-pages/management-container.component";
import {ReservationDetailsComponent} from "../page-components/secure-page/search-results-page/reservation-details-page/reservation-details-page.component";
import {ResourcesPageComponent} from "../page-components/secure-page/configuration-pages/resources-page/resources-page.component";
import {SuccessPageComponent} from "../page-components/secure-page/search-results-page/success-page/success-page.component";
import {UsersPageComponent} from "../page-components/secure-page/configuration-pages/users-page/users-page.component";
import {ConfigurationContainerComponent} from "../page-components/secure-page/configuration-pages/configuration-container.component";
import {AllUsersSectionComponent} from "../page-components/secure-page/configuration-pages/users-page/all-users-section/all-users-section.component";
import {GroupsSectionComponent} from "../page-components/secure-page/configuration-pages/users-page/groups-section/groups-section.component";
import {MyContainerComponent} from "../page-components/secure-page/my-pages/my-container.component";
import {InactiveTenantPage} from "../page-components/inactive-tenant-page/inactive-tenant.page";
import {SuccessRegisterPageComponent} from "../page-components/front-page/success-page/success-page.component";

export const routes: ModuleWithProviders = RouterModule.forRoot([
    {
        path: 'secure',
        component: SecurePageComponent,
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
                        component: UsersPageComponent,
                        children: [
                            {
                                path: '',
                                component: AllUsersSectionComponent
                            },
                            {
                                path: 'groups',
                                component: GroupsSectionComponent
                            },
                            {
                                path: '**',
                                redirectTo: ''
                            }
                        ]
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
        component: InactiveTenantPage
    },
    {
        path: '',
        component: FrontPageComponent,
        children: [
            {
                path: 'sign-in',
                component: SignInComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'success',
                component: SuccessRegisterPageComponent
            },
            {
                path: '**',
                redirectTo: 'sign-in'
            }
        ],
        canActivate: [FrontPageGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
]);