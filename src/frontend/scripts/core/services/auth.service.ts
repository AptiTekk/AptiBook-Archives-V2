/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, ReplaySubject} from "rxjs";
import {Headers} from "@angular/http";
import {User} from "../../models/user.model";
import {Angulartics2} from "angulartics2";

@Injectable()
export class AuthService {

    /**
     * The user currently signed into the application. May be null if no user is signed in.
     */
    private currentUser: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(private apiService: APIService,
                private angulartics2Service: Angulartics2) {
        this.reloadUser();
    }

    /**
     * Forces a reload of the current user from the REST API
     */
    public reloadUser(): void {
        this.apiService.get("users/current").subscribe(
            response => this.currentUser.next(response),
            err => this.currentUser.next(undefined));
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
     * @returns An observable that contains the object of the signed in User.
     */
    public signInAsUser(emailAddress: String, password: String): Observable<User> {
        return Observable.create(listener => {
            this.apiService.get("users/current", new Headers({
                "Authorization": "Basic " + btoa(emailAddress + ":" + password),
                "X-Auth-Type": "user"
            })).subscribe(
                (response: User) => {
                    this.currentUser.next(response);
                    this.angulartics2Service.setUsername.next(response.emailAddress);
                    listener.next(response);
                },
                err => {
                    this.currentUser.next(undefined);
                    this.angulartics2Service.setUsername.next(undefined);
                    listener.error(err);
                }
            );
        });
    }

    /**
     * Attempts to sign into AptiBook as the admin, using the credentials provided.
     * @param password The password of the user.
     * @returns An observable that contains the object of the signed in User.
     */
    public signInAsAdmin(password: String): Observable<User> {
        return Observable.create(listener => {
            this.apiService.get("users/current", new Headers({
                "Authorization": "Basic " + btoa(":" + password),
                "X-Auth-Type": "admin"
            })).subscribe(
                (response: User) => {
                    this.currentUser.next(response);
                    this.angulartics2Service.setUsername.next('admin');
                    listener.next(response);
                },
                err => {
                    this.currentUser.next(undefined);
                    this.angulartics2Service.setUsername.next(undefined);
                    listener.error(err);
                }
            );
        });
    }

    /**
     * Signs the user out of AptiBook by redirect.
     */
    public signOut(): void {
        window.location.href = "/api/sign-out";
    }
}