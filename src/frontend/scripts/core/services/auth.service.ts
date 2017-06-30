/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";
import {Headers} from "@angular/http";
import {User} from "../../models/user.model";
import {UserGroupService} from "./user-group.service";

@Injectable()
export class AuthService {

    /**
     * The user currently signed into the application. May be null if no user is signed in.
     */
    private currentUser: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(private apiService: APIService,
                private userGroupService: UserGroupService) {
        this.reloadUser();
    }

    /**
     * Forces a reload of the current user from the REST API
     */
    public reloadUser(): void {
        this.apiService.get("users/current")
            .then(user => {
                this.currentUser.next(user);
                this.onSignIn();
            })
            .catch(err => this.currentUser.next(undefined));
    }

    /**
     * @returns The User ReplaySubject which is updated infrequently.
     */
    public getCurrentUser(): ReplaySubject<User> {
        return this.currentUser;
    }

    /**
     * Attempts to sign into AptiBook as a regular user, using the credentials provided.
     * @param emailAddress The email address of the user.
     * @param password The password of the user.
     * @returns An promise that gives the signed in User.
     */
    public signInAsUser(emailAddress: String, password: String): Promise<User> {
        return this.apiService.get("users/current", new Headers({
            "Authorization": "Basic " + btoa(emailAddress + ":" + password),
            "X-Auth-Type": "user"
        }))
            .then(user => {
                this.currentUser.next(user);
                this.onSignIn();
                return user;
            })
            .catch(err => {
                this.currentUser.next(undefined);
                throw err;
            })
    }

    /**
     * Attempts to sign into AptiBook as the admin, using the credentials provided.
     * @param password The password of the user.
     * @returns A promise that gives the signed in User.
     */
    public signInAsAdmin(password: String): Promise<User> {
        return this.apiService.get("users/current", new Headers({
            "Authorization": "Basic " + btoa(":" + password),
            "X-Auth-Type": "admin"
        }))
            .then(user => {
                this.currentUser.next(user);
                this.onSignIn();
                return user;
            })
            .catch(err => {
                this.currentUser.next(undefined);
                throw err;
            })
    }

    /**
     * Called upon sign-in as any user. Used to perform actions immediately after a user is signed in.
     */
    private onSignIn(): void {
        this.userGroupService.loadRootUserGroupHierarchy();
    }

    /**
     * Signs the user out by redirect.
     * The sign-out endpoint will clear the user's session and then redirect them to the proper location.
     */
    public static signOut(): void {
        window.location.href = "/api/sign-out";
    }
}