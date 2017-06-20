/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {PermissionsService} from "../../../../core/services/permissions.service";
import {PermissionGroup} from "./permission-group.model";
import {PERMISSION_GROUPS} from "./permission-groups.data";
import {NavigationLink} from "../../../../shared/navigation/navigation-link.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {User} from "../../../../models/user.model";

@Component({
    selector: 'at-configuration-permissions',
    templateUrl: 'permissions.component.html',
    styleUrls: ['permissions.component.scss']
})
export class PermissionsConfigurationComponent implements OnInit, OnDestroy {

    /* Variables for cleanup on destroy */
    paramsSubscription: Subscription;

    /* Instance Variables */

    /**
     * All the Permission Groups available and their details.
     */
    permissionGroups: PermissionGroup[] = PERMISSION_GROUPS;

    /**
     * The Navigation Links for the Permission Group tabs.
     */
    sectionLinks: NavigationLink[] = [];

    /**
     * The currently viewed Permission Group.
     */
    currentPermissionGroup: PermissionGroup;

    /**
     * The User assignments for the current Permission Group.
     */
    currentUserAssignments: { [permission: string]: User[] };

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

                this.permissionsService.getUsersAssignedToPermissionsInGroup(this.currentPermissionGroup.key, false)
                    .then(assignments => {
                        this.currentUserAssignments = assignments;
                    })
            }
        );
    }

    ngOnDestroy(): void {
        this.paramsSubscription.unsubscribe();
    }
}