/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import { Observable, ReplaySubject } from "rxjs";
import {Property} from "../../models/property.model";

@Injectable()
export class PropertiesService {

    private properties = new ReplaySubject<Property[]>(1);

    constructor(private apiService: APIService) {
    }

    public fetchProperties(): void {
        this.apiService.get("properties").subscribe(
                response => this.properties.next(response),
                err => this.properties.next([])
            );
    }

    public getProperties(): ReplaySubject<Property[]> {
        return this.properties;
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