/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {User} from "../../models/user.model";
import {Observable} from "rxjs";
import {error} from "util";
@Injectable()
export class RegistrationService {

    constructor(private apiService: APIService) {

    }

    register(emailAddress: string, firstName: string, lastName: string, password: string, confirmPassword: string) {
        let user: User;
        user.emailAddress = emailAddress;
        user.firstName = firstName;
        user.lastName = lastName;
        user.newPassword = password;
        user.confirmPassword = password;
        return Observable.create(listener => {
            this.apiService.post("register", user).subscribe(
                response => {
                    if (response)
                        listener.next(true);
                    else
                        listener.next(false);
                },
                err => {
                    listener.next(false);
                }
            )
        });
    }
}
