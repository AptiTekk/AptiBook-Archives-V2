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
import {SearchResultsPageComponent} from "../page-components/secure-page/results-container/search-results-page/search-results-page.component";
import {SearchGuard} from "./guards/search.guard";
import {ReservationDetailsComponent} from "../page-components/secure-page/results-container/reservation-details-page/reservation-details-page.component";
import {ResultsContainerComponent} from "../page-components/secure-page/results-container/results-container-page.component";
import {SuccessPageComponent} from "../page-components/secure-page/results-container/success-page/success-page.component";
import {CalendarPageComponent} from "../page-components/secure-page/management/calendar-page/calendar-page.component";
import {PendingPageComponent} from "../page-components/secure-page/management/pending-page/pending-page.component";
import {ApprovedPageComponent} from "../page-components/secure-page/management/approved-page/approved-page.component";
import {RejectedPageComponent} from "../page-components/secure-page/management/rejected-page/rejected-page.component";
import {ManagementContainerComponent} from "../page-components/secure-page/management/management-container.component";

export const routes: ModuleWithProviders = RouterModule.forRoot([
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
            }
        ],
        canActivate: [FrontPageGuard]
    },
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
                component: ResultsContainerComponent,
                canActivate: [SearchGuard],
                children: [
                    {
                        path: 'reservation-details',
                        component: ReservationDetailsComponent,
                    },
                    {
                        path: 'success',
                        component: SuccessPageComponent
                    },
                    {
                        path: '**',
                        component: SearchResultsPageComponent,
                    }
                ]
            },
            {
                path: 'my/account',
                component: AccountPageComponent
            },
            {
                path: 'my/notifications',
                component: NotificationsPageComponent
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
                        path:'approved',
                        component: ApprovedPageComponent
                    },
                    {
                        path:'rejected',
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
        path: '**',
        redirectTo: 'sign-in'
    }
]);