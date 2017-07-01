/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {ResourceService} from "./resource.service";
import {ReplaySubject} from "rxjs";
import {Resource} from "../../models/resource.model";
import moment = require("moment");
import Moment = moment.Moment;

@Injectable()
export class SearchService {

    private searchResults: ReplaySubject<Resource[]> = new ReplaySubject<Resource[]>(1);
    private startTime: ReplaySubject<Moment> = new ReplaySubject<Moment>(1);
    private endTime: ReplaySubject<Moment> = new ReplaySubject<Moment>(1);

    constructor(private resourceService: ResourceService) {
        this.searchResults.next(undefined);
    }

    /**
     * TODO: JAVADOCS
     * @param start
     * @param end
     */
    searchForResources(start: Moment, end: Moment): void {
        this.resourceService.getAvailableResources(start, end)
            .then(results => {
                this.searchResults.next(results);
                this.startTime.next(start);
                this.endTime.next(end);
            });
    }

    /**
     * TODO: JAVADOCS
     */
    clearResults(): void {
        this.searchResults.next([]);
        this.startTime.next(undefined);
        this.endTime.next(undefined);
    }

    /**
     * TODO: JAVADOCS
     * @returns {ReplaySubject<Resource[]>}
     */
    getSearchResults(): ReplaySubject<Resource[]> {
        return this.searchResults;
    }

    /**
     * TODO: JAVADOCS
     * @returns {ReplaySubject<Moment>}
     */
    getStartTime(): ReplaySubject<Moment> {
        return this.startTime;
    }

    /**
     * TODO: JAVADOCS
     * @returns {ReplaySubject<Moment>}
     */
    getEndTime(): ReplaySubject<Moment> {
        return this.endTime;
    }

}