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
        this.apiService.get("properties")
            .then(response => this.properties.next(response))
            .catch(err => this.properties.next(null));
    }

    /**
     * Gets a ReplaySubject with all the properties after calling fetchProperties at least once.
     */
    public getProperties(): ReplaySubject<Properties> {
        return this.properties;
    }

    /**
     * Gets a single property.
     * @param key The key of the property. Case sensitive.
     * @return a Promise that gives the value of the property.
     */
    public getProperty(key: string): Promise<any> {
        return this.apiService.get("properties/" + key);
    }

    /**
     * Patches all properties at once.
     * @param properties The properties to patch.
     * @returns A promise that gives the properties in their updated state.
     */
    patchProperties(properties: Properties): Promise<Properties> {
        return this.apiService.patch("properties/", properties, false);
    }

    /**
     * Patches a single property.
     * @param key The property key
     * @param value The property value.
     * @returns An promise that gives the property value in its updated state.
     */
    public patchProperty(key: string, value: string): Promise<string> {
        return this.apiService.patch("properties/" + key, value);
    }

}