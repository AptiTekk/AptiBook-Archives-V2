/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";
import {Tenant} from "../../models/tenant.model";

@Injectable()
export class TenantService {

    private tenant: ReplaySubject<Tenant> = new ReplaySubject<Tenant>(1);

    constructor(private apiService: APIService) {
        apiService.get("tenant").subscribe(
            response => this.tenant.next(response),
            err => this.tenant.next(undefined)
        );
    }

    getTenant(): ReplaySubject<Tenant> {
        return this.tenant;
    }

}