/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Permission} from "../../models/permission.model";
import {AuthService} from "./auth.service";

@Injectable()
export class PermissionsService {

    private currentUserPermissions = new ReplaySubject<Permission[]>(1);

    constructor(private apiService: APIService,
                private authService: AuthService) {

        // Listen for user changes and fetch permissions if a user is signed in.
        this.authService.getUser().subscribe(
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
        this.apiService.get("/users/current/permissions").subscribe(
            permissions => {
                this.currentUserPermissions.next(permissions.map(permission => <Permission>{descriptor: permission}));
            }
        )
    }

    /**
     * Gets a ReplaySubject that contains the Permissions for the current user. Emits whenever a User signs in.
     * @returns {ReplaySubject<Permission>}
     */
    public getCurrentUserPermissions(): ReplaySubject<Permission[]> {
        return this.currentUserPermissions;
    }



}