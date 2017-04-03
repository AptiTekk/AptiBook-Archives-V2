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

@Injectable()
export class AuthService {

    private user: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(private apiService: APIService) {
        this.reloadUser();
    }

    /**
     * Forces a reload of the user from the REST API
     */
    public reloadUser(): void {
        this.apiService.get("users/current").subscribe(
            response => this.user.next(response),
            err => this.user.next(undefined));
    }

    /**
     * @returns The User ReplaySubject which is updated infrequently.
     */
    public getUser(): ReplaySubject<User> {
        return this.user;
    }

    /**
     * Signs the user into AptiBook using the credentials provided.
     * @param emailAddress The email address of the user.
     * @param password The password of the user.
     * @returns An observable that contains the object of the signed in User.
     */
    public signIn(emailAddress: String, password: String): Observable<User> {
        return Observable.create(listener => {
            this.apiService.get("users/current", new Headers({
                "Authorization": "Basic " + btoa(emailAddress + ":" + password)
            })).subscribe(
                response => {
                    this.user.next(response);
                    listener.next(response);
                },
                err => {
                    this.user.next(undefined);
                    listener.error(err);
                }
            );
        });
    }

    /**
     * Signs the user out of AptiBook
     * @returns An observable with no data.
     */
    public signOut(): Observable<void> {
        return Observable.create(listener => {
            this.apiService.get("auth/sign-out").subscribe(
                response => {
                    this.user.next(undefined);
                    listener.next()
                },
                err => {
                    listener.error(err);
                }
            );
        });
    }
}