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
import {ConfigurationGuard} from "./configuration.guard";
import {ConfigurationComponent} from "./configuration.component";

const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent,
        canActivate: [ConfigurationGuard],
        children: [
            { //TODO: Resources Guard
                path: 'resources',
                component: ResourcesConfigurationComponent
            },
            {
                path: 'resources/:categoryName',
                component: ResourcesConfigurationComponent,
            },
            { //TODO: User and User Group Guards
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
            { //TODO: Permissions Page and Guard
                path: 'permissions/:key',
                component: PermissionsConfigurationComponent
            },
            { //TODO: Permissions Page and Guard
                path: 'permissions',
                redirectTo: 'permissions/general'
            },
            { //TODO: Properties Guard
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
    ],
    providers: [
        ConfigurationGuard
    ]
})
export class ConfigurationRoutesModule {
}