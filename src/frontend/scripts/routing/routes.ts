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
import {UpcomingReservationsPanelComponent} from "../page-components/secure-page/dashboard-page/upcoming-reservations-panel/upcoming-reservations-panel.component";
import {ReservationsPageComponent} from "../page-components/secure-page/my-pages/reservations-page/reservations-page.component";

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