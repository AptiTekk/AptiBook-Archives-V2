/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {PermissionsService} from "../../../../core/services/permissions.server";
import {PermissionGroup} from "./permission-group.model";
import {PERMISSION_GROUPS} from "./permission-groups.data";

@Component({
    selector: 'at-configuration-permissions',
    templateUrl: 'permissions.component.html'
})
export class PermissionsConfigurationComponent implements OnInit {

    permissionGroups: PermissionGroup[] = PERMISSION_GROUPS;

    constructor(private permissionsService: PermissionsService) {
    }

    ngOnInit() {
    }

}