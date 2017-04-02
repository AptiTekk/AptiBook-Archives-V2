/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import Moment = moment.Moment;
import moment = require("moment");
import {Component, OnInit, ViewChild} from "@angular/core";
import {AlertComponent} from "../../../shared/alert/alert.component";
import {Router} from "@angular/router";
import {Resource} from "../../../models/resource.model";
import {ResourceCategory} from "../../../models/resource-category.model";
import {SearchService} from "../../../core/services/search.service";
import {APIService} from "../../../core/services/api.service";
import {ResourceCategoryService} from "../../../core/services/resource-category.service";
import {ReservationDetailsService} from "../../../core/services/reservation-details.service";

@Component({
    selector: 'at-search-results',
    templateUrl: 'search-results.component.html',
    styleUrls: ['search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

    @ViewChild("resultsUpdatedAlert")
    resultsUpdatedAlert: AlertComponent;

    resource: Resource;
    availableResources: Resource[];
    resourceCategories: ResourceCategory[] = [];

    start: Moment;
    end: Moment;

    constructor(private searchService: SearchService,
                protected apiService: APIService,
                private router: Router,
                private resourceCategoryService: ResourceCategoryService,
                private reservationDetailsService: ReservationDetailsService) {
    }

    ngOnInit(): void {
        this.searchService.getSearchResults().subscribe(resources => {
            this.availableResources = resources;
        });

        this.searchService.getStartTime().subscribe(start => this.start = start);
        this.searchService.getEndTime().subscribe(end => this.end = end);

        this.resourceCategoryService.getResourceCategories().take(1).subscribe(resourceCategory => {
            this.resourceCategories = resourceCategory.map(category => {
                category['enabled'] = true;
                return category;
            });
        });
    }

    onSearch() {
        this.searchService.searchForResources(this.start, this.end);
        this.searchService.getSearchResults().take(1).subscribe(resources => this.resultsUpdatedAlert.display());
    }

    reserve(resource: Resource) {
        this.reservationDetailsService.setResource(resource);
        this.router.navigateByUrl("/secure/search-results/reservation-details");
    }

}