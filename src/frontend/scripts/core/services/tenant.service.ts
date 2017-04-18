/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Tenant} from "../../models/tenant.model";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TenantService {

    constructor(private apiService: APIService) {
    }

    /**
     * Gets the Tenant details.
     * @returns An Observable that should be subscribed to. May emit the Tenant details or an error.
     */
    getTenant(): Observable<Tenant> {
        return Observable.create(listener => {
            this.apiService.get("tenant").subscribe(
                response => listener.next(response),
                err => listener.error(err)
            );
        });
    }

    /**
     * Gets the name of the Tenant for personalization purposes.
     * @returns An Observable that should be subscribed to. May emit the Tenant name or an error.
     */
    getTenantName(): Observable<string> {
        return Observable.create(listener => {
            this.apiService.get("/tenant/name")
                .subscribe(
                    response => listener.next(response['name']),
                    err => listener.error(err)
                );
        });
    }

}