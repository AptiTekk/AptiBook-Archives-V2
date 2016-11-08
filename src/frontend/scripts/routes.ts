import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FrontPageComponent, SignInComponent, RegisterComponent} from "./components/front-page";

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
        path: '**',
        redirectTo: 'sign-in'
    }
]);