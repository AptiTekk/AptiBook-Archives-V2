import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FrontPageComponent, SignInComponent, RegisterComponent, SecurePageComponent} from "../page-components";
import {FrontPageGuard, SecureGuard} from "./guards";

export const routes: ModuleWithProviders = RouterModule.forRoot([
    {
        path: '',
        component: FrontPageComponent,
        children: [
            {
                path: 'sign-in',
                component: SignInComponent,
            },
            {
                path: 'register',
                component: RegisterComponent,
            }
        ],
        canActivate: [FrontPageGuard]
    },
    {
        path: 'secure',
        component: SecurePageComponent,
        canActivate: [SecureGuard]
    },
    {
        path: '**',
        redirectTo: 'sign-in'
    }
]);