import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";

export const routes: ModuleWithProviders = RouterModule.forRoot([
    {path: '', component: LoginComponent}
]);