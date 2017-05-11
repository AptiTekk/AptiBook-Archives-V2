/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {User} from "../../models/user.model";
import {Observable} from "rxjs";

@Injectable()
export class RegistrationService {

    constructor(private apiService: APIService) {
    }

    /**
     * Registers a new user with the details provided in the User object.
     * @param user The User containing the details of the new user.
     * @returns The new User if it was created, or an error message.
     */
    public register(user: User): Observable<any> {
        return Observable.create(listener => {
            this.apiService.post("register", user).subscribe(
                user => {
                    listener.next(user)
                },
                err => {
                    listener.error(err)
                }
            );
        });
    }

    /**
     * Gets any partially-filled user details for registration.
     * @param token The token used for registration.
     * @returns A Promise that gives the partially-filled User.
     */
    public getRegistrationDetails(token: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.apiService.get("register/details?token=" + token)
                .subscribe(
                    user => {
                        resolve(user);
                    },
                    err => {
                        reject(err);
                    }
                )
        });
    }

    /**
     * Registers using the registration token.
     * @param user The user details for registration.
     * @param token The token used for registration.
     * @returns A Promise that gives the newly created User.
     */
    public registerSSO(user: User, token: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.apiService.post("register/sso?token=" + token, user)
                .subscribe(
                    user => {
                        resolve(user);
                    },
                    err => {
                        reject(err);
                    }
                )
        });
    }
}
