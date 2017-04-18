/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, ReplaySubject} from "rxjs";
import {Properties} from "../../models/properties.model";

@Injectable()
export class PropertiesService {

    private properties = new ReplaySubject<Properties>(1);

    constructor(private apiService: APIService) {
    }

    public fetchProperties(): void {
        this.apiService.get("properties").subscribe(
            response => this.properties.next(response),
            err => this.properties.next(null)
        );
    }

    public getProperties(): ReplaySubject<Properties> {
        return this.properties;
    }

    /**
     * Patches all properties at once.
     * @param properties The properties to patch.
     * @returns An observable that should be subscribed to. May emit the updated properties or an error.
     */
    patchProperties(properties: Properties): Observable<Properties> {
        return Observable.create(listener => {
            this.apiService.patch("properties/", properties, false).subscribe(
                response => listener.next(response),
                err => listener.error(err)
            )
        });
    }

    /**
     * Patches a single property.
     * @param key The property key
     * @param value The property value.
     * @returns An observable that should be subscribed to. May emit the updated value or an error.
     */
    public patchProperty(key: string, value: string): Observable<string> {
        return Observable.create(listener => {
            this.apiService.patch("properties/" + key, value).subscribe(
                response => listener.next(response),
                err => listener.error(err)
            )
        });
    }

}