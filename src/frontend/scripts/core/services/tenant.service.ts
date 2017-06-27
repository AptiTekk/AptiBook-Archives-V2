/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Tenant} from "../../models/tenant.model";

@Injectable()
export class TenantService {

    constructor(private apiService: APIService) {
    }

    /**
     * Gets the Tenant details.
     * @returns A Promise that gives the Tenant details.
     */
    getTenant(): Promise<Tenant> {
        return new Promise((resolve, reject) => {
            this.apiService.get("tenant")
                .then(response => resolve(response))
                .catch(err => reject(err))
        });
    }

}