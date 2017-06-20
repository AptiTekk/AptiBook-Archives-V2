/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {PermissionsService} from "../../../../core/services/permissions.service";
import {PermissionGroup} from "./permission-group.model";
import {PERMISSION_GROUPS} from "./permission-groups.data";
import {UserPermissionAssignments} from "../../../../models/permissions/permission-assignments";
import {NavigationLink} from "../../../../shared/navigation/navigation-link.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'at-configuration-permissions',
    templateUrl: 'permissions.component.html',
    styleUrls: ['permissions.component.scss']
})
export class PermissionsConfigurationComponent implements OnInit, OnDestroy {

    /* Variables for cleanup on destroy */
    paramsSubscription: Subscription;

    /* Instance Variables */
    permissionGroups: PermissionGroup[] = PERMISSION_GROUPS;
    currentPermissionGroup: PermissionGroup;
    sectionLinks: NavigationLink[] = [];

    userPermissionAssignments: UserPermissionAssignments;

    constructor(private permissionsService: PermissionsService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        // Map group data to navigation links
        this.sectionLinks = this.permissionGroups.map(permissionGroup => {
            return {
                label: permissionGroup.name,
                path: ['', 'secure', 'configuration', 'permissions', permissionGroup.key.toLowerCase()]
            }
        });
    }

    ngOnInit(): void {

        // Get the current permission group from the slug param.
        this.paramsSubscription = this.activatedRoute.params.subscribe(
            params => {
                let filteredGroups = this.permissionGroups.filter(group => group.key.toLowerCase() === params['key']);
                if (filteredGroups.length == 0) {
                    this.router.navigate(['', 'secure', 'configuration', 'permissions', this.permissionGroups[0].key.toLowerCase()]);
                } else {
                    this.currentPermissionGroup = filteredGroups[0];
                }
            }
        );

        // Get the users assigned to each permission.
        this.permissionsService.getUsersAssignedToPermissions()
            .subscribe(
                assignments => {
                    // Filter admin user from assignments.
                    for(let group in assignments) {
                        assignments[group] = assignments[group].filter(user => !user.admin);
                    }
                    this.userPermissionAssignments = assignments;
                }
            )
    }

    ngOnDestroy(): void {
        this.paramsSubscription.unsubscribe();
    }
}