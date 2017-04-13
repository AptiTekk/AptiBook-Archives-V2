/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {PermissionsService} from "../../../../core/services/permissions.service";
import {PermissionGroup} from "./permission-group.model";
import {PERMISSION_GROUPS} from "./permission-groups.data";
import {UserPermissionAssignments} from "../../../../models/permissions/permission-assignments";

@Component({
    selector: 'at-configuration-permissions',
    templateUrl: 'permissions.component.html'
})
export class PermissionsConfigurationComponent implements OnInit {

    permissionGroups: PermissionGroup[] = PERMISSION_GROUPS;
    userPermissionAssignments: UserPermissionAssignments;

    constructor(private permissionsService: PermissionsService) {
    }

    ngOnInit() {
        // Get the users assigned to each permission.
        this.permissionsService.getUsersAssignedToPermissions()
            .subscribe(
                assignments => this.userPermissionAssignments = assignments
            )
    }

}