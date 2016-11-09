import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FrontPageComponent, SignInComponent, RegisterComponent, SecurePageComponent} from "./components";

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
                data: {
                    help: [
                        {title: 'How to Register', slug: 'ab-how-to-register'}
                    ]
                }
            }
        ]

    },
    {
        path: 'secure',
        component: SecurePageComponent
    },
    {
        path: '**',
        redirectTo: 'sign-in'
    }
]);