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

    searchForResources(start: Moment, end: Moment) {
        this.resourceService.fetchAvailableResources(start, end).take(1).subscribe(results => {
            this.searchResults.next(results);
            this.startTime.next(start);
            this.endTime.next(end);
        });
    }

    clearResults() {
        this.searchResults.next([]);
        this.startTime.next(undefined);
        this.endTime.next(undefined);
    }

    getSearchResults(): ReplaySubject<Resource[]> {
        return this.searchResults;
    }

    getStartTime(): ReplaySubject<Moment> {
        return this.startTime;
    }

    getEndTime(): ReplaySubject<Moment> {
        return this.endTime;
    }

}