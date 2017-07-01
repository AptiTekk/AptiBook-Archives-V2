/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {PermissionsService} from "../../../../core/services/permissions.service";
import {PermissionGroup} from "./permission-group.model";
import {PERMISSION_GROUPS} from "./permission-groups.data";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {User} from "../../../../models/user.model";
import {UserGroup} from "../../../../models/user-group.model";
import {Permission} from "./permission.model";

@Component({
    selector: 'at-configuration-permissions',
    templateUrl: 'permissions.component.html',
    styleUrls: ['permissions.component.scss']
})
export class PermissionsConfigurationComponent implements OnInit, OnDestroy {

    /**
     * Observable Subscriptions for this component.
     */
    subscriptions: Subscription[] = [];

    /**
     * All the Permission Groups available and their details.
     */
    permissionGroups: PermissionGroup[] = PERMISSION_GROUPS;

    /**
     * The currently viewed Permission Group.
     */
    currentPermissionGroup: PermissionGroup;

    /**
     * The User assignments for all Permission Groups.
     */
    userAssignments: { [permissionGroup: string]: { [permission: string]: User[] } };

    /**
     * The User Group assignments for all Permission Groups.
     */
    userGroupAssignments: { [permissionGroup: string]: { [permission: string]: UserGroup[] } };

    constructor(private permissionsService: PermissionsService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        // Get the Users assigned to all Permissions.
        this.permissionsService.getUsersAssignedToPermissionsInAllGroups(false)
            .then(assignments => {
                this.userAssignments = assignments;
            });

        // Get the User Groups assigned to all Permissions.
        this.permissionsService.getUserGroupsAssignedToPermissionsInAllGroups()
            .then(assignments => {
                this.userGroupAssignments = assignments;
            });

        // Get the current permission group from the key param.
        this.subscriptions.push(this.activatedRoute.params.subscribe(
            params => {
                let filteredGroups = this.permissionGroups.filter(group => group.key.toLowerCase() === params['key']);
                if (!filteredGroups) {
                    this.router.navigate(['', 'secure', 'configuration', 'permissions', this.permissionGroups[0].key.toLowerCase()]);
                } else {
                    this.currentPermissionGroup = filteredGroups[0];
                }
            }
        ));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    getUserAssignmentsForPermission(permission: Permission): User[] {
        if(this.userAssignments == null)
            return [];
        if(!this.userAssignments[this.currentPermissionGroup.key])
            return [];
        if(!this.userAssignments[this.currentPermissionGroup.key][permission.key])
            return [];
        return this.userAssignments[this.currentPermissionGroup.key][permission.key];
    }

    getUserGroupAssignmentsForPermission(permission: Permission): User[] {
        if(this.userGroupAssignments == null)
            return [];
        if(!this.userGroupAssignments[this.currentPermissionGroup.key])
            return [];
        if(!this.userGroupAssignments[this.currentPermissionGroup.key][permission.key])
            return [];
        return this.userGroupAssignments[this.currentPermissionGroup.key][permission.key];
    }
}