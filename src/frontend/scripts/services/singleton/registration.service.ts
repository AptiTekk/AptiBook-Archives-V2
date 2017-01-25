/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {User} from "../../models/user.model";
import {Observable, ReplaySubject} from "rxjs";
import {error} from "util";
@Injectable()
export class RegistrationService {

    private registeredUser: ReplaySubject<User> = new ReplaySubject<User>(1);


    constructor(private apiService: APIService) {

    }
    register(user: User) {
        return Observable.create(listener => {
            console.log("here");
            let body = JSON.stringify(user);
                this.apiService.post("register", body).subscribe(
                    response => {
                        listener.next(response);
                        this.registeredUser.next(user);
                    },
                    err => listener.next(undefined)
                );
            });
    }

    public getRegisteredUser(): ReplaySubject<User>{
        return this.registeredUser;
    }

}
