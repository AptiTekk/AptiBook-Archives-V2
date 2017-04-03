
/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Resource} from "../../models/resource.model";
import Moment = moment.Moment;
import moment = require("moment");
import {SearchService} from "./search.service";
@Injectable()
export class ReservationDetailsService {

    private resource: Resource;
    start: Moment;
    end: Moment;

    constructor(private apiService: APIService, private searchService: SearchService) {
        searchService.getStartTime().subscribe(start => this.start = start);
        searchService.getEndTime().subscribe(end => this.end = end);
    }

    getResource(){
        return this.resource;
    }
    setResource(resource: Resource){
        this.resource = resource;
    }


}