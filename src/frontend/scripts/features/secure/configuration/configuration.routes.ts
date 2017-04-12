/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ResourcesConfigurationComponent} from "./resources/resources.component";
import {UsersConfigurationComponent} from "./users/users.component";
import {AllUsersComponent} from "./users/all-users/all-users.component";
import {GroupsComponent} from "./users/groups/groups.component";
import {PropertiesConfigurationComponent} from "./properties/properties.component";
import {PermissionsConfigurationComponent} from "./permissions/permissions.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'resources',
                component: ResourcesConfigurationComponent
            },
            {
                path: 'resources/:resourceCategory',
                component: ResourcesConfigurationComponent,
            },
            {
                path: 'users',
                component: UsersConfigurationComponent,
                children: [
                    {
                        path: '',
                        component: AllUsersComponent
                    },
                    {
                        path: 'groups',
                        component: GroupsComponent
                    },
                    {
                        path: '**',
                        redirectTo: ''
                    }
                ]
            },
            {
                path: 'permissions',
                component: PermissionsConfigurationComponent
            },
            {
                path: 'properties/:section',
                component: PropertiesConfigurationComponent
            },
            {
                path: 'properties',
                redirectTo: 'properties/personalization'
            },
            {
                path: '**',
                redirectTo: 'resources'
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
export class ConfigurationRoutesModule {
}