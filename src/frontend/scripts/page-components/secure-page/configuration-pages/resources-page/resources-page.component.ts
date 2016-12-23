import {Component} from "@angular/core";
import {ResourceCategoryService} from "../../../../services/singleton/resource-category.service";
import {ResourceCategory} from "../../../../models/resource-category.model";
import {ActivatedRoute, Router} from "@angular/router";
import {APIService} from "../../../../services/singleton/api.service";
import {Resource} from "../../../../models/resource.model";
import {ResourceService} from "../../../../services/singleton/resource.service";

@Component({
    selector: 'resources-page',
    templateUrl: 'resources-page.component.html',
    styleUrls: ['resources-page.component.css']
})
export class ResourcesPageComponent {

    currentResourceCategory: ResourceCategory;
    resourceCategories: ResourceCategory[];

    resourceForDeletion: Resource;

    constructor(private router: Router,
                route: ActivatedRoute,
                protected apiService: APIService,
                private resourceCategoryService: ResourceCategoryService,
                private resourceService: ResourceService) {

        resourceCategoryService.getResourceCategories().subscribe(resourceCategories => {
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

    onNewCategory(newCategory: {name: string}) {
        this.resourceCategoryService.addNewResourceCategory(newCategory.name).subscribe(
            category => {
                this.resourceCategoryService.fetchResourceCategories();
                if (category) {
                    this.router.navigate(['', 'secure', 'configuration', 'resources', category.name.toLowerCase()]);
                }
            }
        );
    }

    onEditCategory(category: ResourceCategory) {
        this.resourceCategoryService.patchResourceCategory(category).subscribe(
            category => {
                this.resourceCategoryService.fetchResourceCategories();
                if (category) {
                    this.router.navigate(['', 'secure', 'configuration', 'resources', category.name.toLowerCase()]);
                }
            }
        )
    }

    onDeleteCategory() {
        this.resourceCategoryService.deleteResourceCategory(this.currentResourceCategory).subscribe(
            response => {
                this.resourceCategoryService.fetchResourceCategories();
                this.router.navigate(['', 'secure', 'configuration', 'resources']);
            }
        )
    }

    onNewResource() {
        this.resourceCategoryService.fetchResourceCategories();
    }

    onDeleteResource() {
        if (!this.resourceForDeletion)
            return;

        this.resourceService.deleteResource(this.resourceForDeletion).subscribe(
            response => {
                this.resourceCategoryService.fetchResourceCategories();
            }
        )
    }

}