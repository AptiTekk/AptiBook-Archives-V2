import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Resource} from "../../models/resource.model";
import {ReplaySubject} from "rxjs";
import Moment = moment.Moment;
import moment = require("moment");

@Injectable()
export class ResourceService {

    private availableResources: ReplaySubject<Resource[]> = new ReplaySubject<Resource[]>(1);

    constructor(private apiService: APIService) {
    }

    fetchAvailableResources(start: Moment, end: Moment) {
        this.apiService
            .get("/resources/available?start=" + start.utc().format("YYYY-MM-DDTHH:mm") + "&end=" + end.utc().format("YYYY-MM-DDTHH:mm"))
            .subscribe(
                resources => this.availableResources.next(<Resource[]>resources),
                err => this.availableResources.next(undefined));
    }

}