/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Permission} from "../../models/permissions/permission.model";
import {AuthService} from "./auth.service";
import {User} from "../../models/user.model";
import {UserGroup} from "../../models/user-group.model";

@Injectable()
export class PermissionsService {

    private currentUserPermissions = new ReplaySubject<Permission[]>(1);

    constructor(private apiService: APIService,
                private authService: AuthService) {

        // Listen for user changes and fetch permissions if a user is signed in.
        this.authService.getCurrentUser().subscribe(
            user => {
                if (user)
                    this.fetchCurrentUserPermissions();
            }
        )
    }

    /**
     * Fetches the current user's permissions and stores them in the currentUserPermissions ReplaySubject.
     * Automatically called internally whenever a user signs in. Only call externally if necessary
     * to reload the current user's permissions.
     */
    public fetchCurrentUserPermissions(): void {
        this.apiService.get("/users/current/permissions")
            .then(permissions => this.currentUserPermissions.next(permissions.map(permission => <Permission>{descriptor: permission})));
    }

    /**
     * Gets a ReplaySubject that contains the Permissions for the current user. Emits whenever a User signs in.
     * @returns {ReplaySubject<Permission>}
     */
    public getCurrentUserPermissions(): ReplaySubject<Permission[]> {
        return this.currentUserPermissions;
    }

    /**
     * For each Permission in each Permission Group, lists the Users assigned the Permission.
     *
     * @param inherited Whether or not to include inherited permissions from User Groups.
     *
     * @returns A Promise that emits a map of Permission Groups to Permissions to assigned User Groups.
     */
    public getUsersAssignedToPermissionsInAllGroups(inherited: boolean = true): Promise<{ [permissionGroup: string]: { [permission: string]: User[] } }> {
        return new Promise((resolve, reject) => {
            this.apiService.get("permissions/users?inherited=" + inherited)
                .then(assignments => resolve(assignments))
                .catch(err => reject(err));
        })
    }

    /**
     * For each Permission in a Permission Group, lists the Users assigned the Permission.
     *
     * @param groupKey The key of the Permission Group.
     * @param inherited Whether or not to include inherited permissions from User Groups.
     *
     * @returns A Promise that emits a map of Permissions to assigned Users.
     */
    public getUsersAssignedToPermissionsInGroup(groupKey: string, inherited: boolean = true): Promise<{ [permission: string]: User[] }> {
        return new Promise((resolve, reject) => {
            this.apiService.get("permissions/groups/" + groupKey + "/users?inherited=" + inherited)
                .then(assignments => resolve(assignments))
                .catch(err => reject(err));
        })
    }

    /**
     * For each Permission in each Permission Group, lists the Users assigned the Permission.
     *
     * @returns A Promise that emits a map of Permission Groups to Permissions to assigned User Groups.
     */
    public getUserGroupsAssignedToPermissionsInAllGroups(): Promise<{ [permissionGroup: string]: { [permission: string]: UserGroup[] } }> {
        return new Promise((resolve, reject) => {
            this.apiService.get("permissions/user_groups")
                .then(assignments => resolve(assignments))
                .catch(err => reject(err));
        })
    }

    /**
     * For each Permission in a Permission Group, lists the User Groups assigned the Permission.
     *
     * @param groupKey The key of the Permission Group.
     *
     * @returns A Promise that emits a map of Permissions to assigned User Groups.
     */
    public getUserGroupsAssignedToPermissionsInGroup(groupKey: string): Promise<{ [permission: string]: UserGroup[] }> {
        return new Promise((resolve, reject) => {
            this.apiService.get("permissions/groups/" + groupKey + "/user_groups")
                .then(assignments => resolve(assignments))
                .catch(err => reject(err));
        })
    }

}