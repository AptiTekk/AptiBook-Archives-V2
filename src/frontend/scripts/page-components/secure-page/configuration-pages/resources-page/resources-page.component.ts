import {Component} from "@angular/core";
import {ResourceCategoryService} from "../../../../services/singleton/resource-category.service";
import {ResourceCategory} from "../../../../models/resource-category.model";
import {ActivatedRoute} from "@angular/router";
import {APIService} from "../../../../services/singleton/api.service";

@Component({
    selector: 'resources-page',
    templateUrl: 'resources-page.component.html',
    styleUrls: ['resources-page.component.css']
})
export class ResourcesPageComponent {

    currentResourceCategory: ResourceCategory;
    resourceCategories: ResourceCategory[];

    constructor(route: ActivatedRoute,
                protected apiService: APIService,
                resourceCategoryService: ResourceCategoryService) {
        
        resourceCategoryService.getResourceCategories().take(1).subscribe(resourceCategories => {
            this.resourceCategories = resourceCategories;

            route.params.subscribe(params => {
                let resourceCategoryName = params['resourceCategory'];
                if (resourceCategoryName) {
                    let filteredCategories = this.resourceCategories.filter(resourceCategory => resourceCategory.name.toLowerCase() === resourceCategoryName.toLowerCase());
                    if (filteredCategories.length > 0) {
                        this.currentResourceCategory = filteredCategories[0];
                        return;
                    }
                }

                this.currentResourceCategory = this.resourceCategories[0];
            });
        });
    }

}