/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";
import {Property} from "../../models/property.model";

@Injectable()
export class PropertiesService {

    constructor(private apiService: APIService) {

    }

    public getAllProperties() {
        return Observable.create(listener => {
            this.apiService.get("properties").subscribe(
                response => listener.next(response),
                err => listener.err(err)
            )
        });
    }

    public patchProperty(property: Property) {
        return Observable.create(listener => {
            this.apiService.patch("properties/" + property.keyName, property).subscribe(
                response => listener.next(response),
                err => listener.error(err)
            )
        })
    }
}