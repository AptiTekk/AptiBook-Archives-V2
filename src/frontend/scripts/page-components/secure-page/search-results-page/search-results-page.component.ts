import Moment = moment.Moment;
import moment = require("moment");
import {Component, ViewEncapsulation, ViewChild} from "@angular/core";
import {AlertComponent} from "../../../components/alert/alert.component";
import {Router} from "@angular/router";
import {Resource} from "../../../models/resource.model";
import {ResourceCategory} from "../../../models/resource-category.model";
import {SearchService} from "../../../services/singleton/search.service";
import {APIService} from "../../../services/singleton/api.service";
import {ResourceCategoryService} from "../../../services/singleton/resource-category.service";
import {ReservationDetailsService} from "../../../services/singleton/reservation-details.service";

@Component({
    selector: 'search-results-page',
    templateUrl: 'search-results-page.component.html',
    styleUrls: ['search-results-page.component.css']
})
export class SearchResultsPageComponent {

    @ViewChild("resultsUpdatedAlert")
    resultsUpdatedAlert: AlertComponent;

    router: Router;
    resource: Resource;
    availableResources: Resource[];
    resourceCategories: ResourceCategory[] = [];

    start: Moment;
    end: Moment;

    constructor(private searchService: SearchService, protected apiService: APIService, router: Router, private resourceCategoryService: ResourceCategoryService, private reservationDetailsService: ReservationDetailsService) {
        this.router = router;
        searchService.getSearchResults().subscribe(resources => {
            this.availableResources = resources;
        });
        searchService.getStartTime().subscribe(start => this.start = start);
        searchService.getEndTime().subscribe(end => this.end = end);

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