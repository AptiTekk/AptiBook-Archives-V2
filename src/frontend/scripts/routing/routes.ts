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
import {PendingPageComponent} from "../page-components/secure-page/management-pages/pending-page/pending-page.component";
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
import {InactiveTenantPageComponent} from "../page-components/inactive-tenant-page/inactive-tenant-page.component";
import {SuccessRegisterPageComponent} from "../page-components/front-page/register/success-page/success-page.component";

export const routes: ModuleWithProviders = RouterModule.forRoot([
    {
        path: 'secure',
        component: SecurePageComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardPageComponent
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
                component: MyContainerComponent,
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
                component: ConfigurationContainerComponent,
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
                        path: 'pending',
                        component: PendingPageComponent
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
        component: InactiveTenantPageComponent
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