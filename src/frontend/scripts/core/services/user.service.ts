/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {User} from "../../models/user.model";
import {Observable, ReplaySubject} from "rxjs";

@Injectable()
export class UserService {

    /**
     * TODO: JAVADOCS
     * @type {ReplaySubject<User[]>}
     */
    users: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

    constructor(private apiService: APIService) {
    }

    /**
     * TODO: JAVADOCS
     */
    public fetchUsers(): void {
        this.apiService.get("/users")
            .then(response => this.users.next(response))
    }

    /**
     * TODO: JAVADOCS
     * @returns {ReplaySubject<User[]>}
     */
    public getUsers(): ReplaySubject<User[]> {
        return this.users;
    }

    /**
     * TODO: JAVADOCS
     * @param user
     * @returns {any}
     */
    public addNewUser(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            this.apiService.post("users", user)
                .then(response => resolve(response))
                .catch(err => reject(err))
        });
    }

    /**
     * TODO: JAVADOCS
     * @param user
     * @returns {any}
     */
    public patchUser(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            this.apiService.patch("users/" + user.id, user)
                .then(response => resolve(response))
                .catch(err => reject(err))
        });
    }

    /**
     * TODO: JAVADOCS
     * @param user
     * @returns {any}
     */
    public deleteUser(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.del("users/" + user.id)
                .then(response => resolve(),
                    err => reject(err)
                );
        });
    }
}