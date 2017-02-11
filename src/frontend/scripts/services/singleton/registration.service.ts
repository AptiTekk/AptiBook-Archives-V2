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


    private registerMessage: ReplaySubject<string> = new ReplaySubject<string>(1);

    /**
     * @returns The registration message (a message that should be shown to users) ReplaySubject
     */
    public getRegisterMessage(): ReplaySubject<string> {
        return this.registerMessage;
    }


    constructor(private apiService: APIService) {

    }
    register(user: User) {
        return Observable.create(listener => {
            let body = JSON.stringify(user);
                this.apiService.post("register", body).subscribe(
                    response => {
                        listener.next(response);
                        this.registerMessage.next(undefined);
                    },
                    err =>{
                        listener.next(undefined);
                        this.registerMessage.next(err.json.error());
                    }
                );
            });
    }


}
