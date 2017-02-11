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

    constructor(private apiService: APIService) {

    }
    register(user: User): Observable<boolean> {
        return Observable.create(listener => {
            let body = JSON.stringify(user);
                this.apiService.post("register", body).subscribe(
                    response => {
                        listener.next(true);
                    },
                    err =>{
                        listener.next(false);
                    }
                );
            });
    }


}
