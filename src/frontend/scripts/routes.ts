import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FrontPageComponent} from "./components/front-page/front-page.component";
import {SignInComponent} from "./components/front-page/sign-in/sign-in.component";
import {RegisterComponent} from "./components/front-page/register/register.component";

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
                component: SignInComponent
            }
        ]
    }
]);