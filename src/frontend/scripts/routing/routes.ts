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
import {ReservationsPageComponent} from "../page-components/secure-page/my-pages/reservations-page/reservations-page.component";
import {SearchResultsPageComponent} from "../page-components/secure-page/results-container/search-results-page/search-results-page.component";
import {SearchGuard} from "./guards/search.guard";
import {ReservationDetailsComponent} from "../page-components/secure-page/results-container/reservation-details-page/reservation-details-page.component";
import {ResultsContainerComponent} from "../page-components/secure-page/results-container/results-container-page.component";

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
                path:'search-results',
                component: ResultsContainerComponent,
                canActivate: [SearchGuard],
                children: [

                    {
                        path: 'reservation-details',
                        component: ReservationDetailsComponent
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
                path: 'my/reservations',
                component: ReservationsPageComponent
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