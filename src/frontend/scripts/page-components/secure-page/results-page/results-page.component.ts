import {Component, ViewEncapsulation, ViewChild} from "@angular/core";
import {Resource} from "../../../models/resource.model";
import {APIService} from "../../../services/singleton/api.service";
import {SearchService} from "../../../services/singleton/search.service";
import {AlertComponent} from "../../../components/alert/alert.component";
import {Router} from "@angular/router";
import {ResourceCategoryService} from "../../../services/singleton/resource-category.service";
import {ResourceCategory} from "../../../models/resource-category.model";
import Moment = moment.Moment;
import moment = require("moment");


@Component({
    selector: 'results-page',
    templateUrl: 'results-page.component.html',
    styleUrls: ['results-page.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ResultsPageComponent {


    @ViewChild("resultsUpdatedAlert")
    resultsUpdatedAlert: AlertComponent;

    resource: Resource;
    availableResources: Resource[];
    resourceCategories: ResourceCategory[] = [];

    start: Moment;
    end: Moment;

    constructor(private searchService: SearchService, protected apiService: APIService, router: Router, private resourceCategoryService: ResourceCategoryService) {
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

}