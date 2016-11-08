import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FrontPageComponent, SignInComponent, RegisterComponent} from "./components/front-page";

export const routes: ModuleWithProviders = RouterModule.forRoot([
    {
        path: '',
        component: FrontPageComponent,
        children: [
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: '**',
                component: SignInComponent,
                data: {
                    help: [
                        {title: 'How to Sign In', slug: 'ab-how-to-sign-in'}
                    ]
                }
            }
        ]
    }
]);