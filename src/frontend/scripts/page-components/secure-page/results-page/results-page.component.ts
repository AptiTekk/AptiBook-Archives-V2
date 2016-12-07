import {Component, ViewEncapsulation, ViewChild} from "@angular/core";
import {Resource} from "../../../models/resource.model";
import {APIService} from "../../../services/singleton/api.service";
import {SearchService} from "../../../services/singleton/search.service";
import {AlertComponent} from "../../../components/alert/alert.component";
import {Router} from "@angular/router";
import Moment = moment.Moment;
import moment = require("moment");
import {ResourceCategoryService} from "../../../services/singleton/resource-category.service";
import {ResourceCategoryFilter} from "../../../models/resource-category-filter.model";


@Component({
    selector: 'results-page',
    templateUrl: 'results-page.component.html',
    styleUrls: ['results-page.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ResultsPageComponent  {


    @ViewChild("resultsUpdatedAlert")
    resultsUpdatedAlert: AlertComponent;

    onChange(event, id){
        if(event.target.value===true){
            this.resourceCategoryFilters.find(id)
        }

    }

    resource: Resource;
    availableResources: Resource[];
    resourceCategoryFilters: ResourceCategoryFilter[] = [];

    start: Moment;
    end: Moment;

    constructor(private searchService: SearchService, protected apiService: APIService, router: Router, private resourceCategoryService: ResourceCategoryService) {
        searchService.getSearchResults().subscribe(resources => {
            /*if (resources == undefined)
                router.navigateByUrl("/secure/");
            else*/
                this.availableResources = resources;
        });
        searchService.getStartTime().subscribe(start => this.start = start);
        searchService.getEndTime().subscribe(end => this.end = end);
        this.resourceCategoryService.getResourceCategory().take(1).subscribe(resourceCategory => {
            this.resourceCategoryFilters =  <ResourceCategoryFilter[]>resourceCategory;
        });
    }

    onSearch() {
        this.searchService.searchForResources(this.start, this.end);
        this.searchService.getSearchResults().take(1).subscribe(resources => this.resultsUpdatedAlert.display());
    }

}