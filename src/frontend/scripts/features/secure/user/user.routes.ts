/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AccountComponent} from "./account/account.component";
import {NotificationsComponent} from "./notifications/notifications.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'account',
                component: AccountComponent
            },
            {
                path: 'notifications',
                component: NotificationsComponent
            },
            {
                path: '**',
                redirectTo: 'account'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class UserRoutesModule {
}