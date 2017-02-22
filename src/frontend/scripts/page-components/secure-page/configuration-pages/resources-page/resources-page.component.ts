/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {ResourceCategoryService} from "../../../../services/singleton/resource-category.service";
import {ResourceCategory} from "../../../../models/resource-category.model";
import {ActivatedRoute, Router} from "@angular/router";
import {APIService} from "../../../../services/singleton/api.service";
import {Resource} from "../../../../models/resource.model";
import {ResourceService} from "../../../../services/singleton/resource.service";
import {UserGroup} from "../../../../models/user-group.model";
import {UserGroupService} from "../../../../services/singleton/usergroup.service";

@Component({
    selector: 'resources-page',
    templateUrl: 'resources-page.component.html',
    styleUrls: ['resources-page.component.css']
})
export class ResourcesPageComponent implements OnInit {

    currentResourceCategory: ResourceCategory;
    resourceCategories: ResourceCategory[];
    rootGroup: UserGroup;

    resourceForDeletion: Resource;

    constructor(private router: Router,
                private route: ActivatedRoute,
                protected apiService: APIService,
                private resourceCategoryService: ResourceCategoryService,
                private resourceService: ResourceService,
                private userGroupService: UserGroupService) {
    }

    ngOnInit(): void {
        this.resourceCategoryService.fetchResourceCategories();

        this.resourceCategoryService
            .getResourceCategories()
            .subscribe(resourceCategories => {
                this.resourceCategories = resourceCategories;

                this.route.params
                    .subscribe(params => {
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

        this.userGroupService.getRootUserGroup().subscribe(
            rootGroup => this.rootGroup = rootGroup
        );
    }

    onNewCategory(resourceCategory: ResourceCategory) {
        this.resourceCategoryService.fetchResourceCategories();
        this.router.navigate(['', 'secure', 'configuration', 'resources', resourceCategory.name.toLowerCase()]);
    }

    onEditCategory(resourceCategory: ResourceCategory) {
        this.resourceCategoryService.fetchResourceCategories();
        this.router.navigate(['', 'secure', 'configuration', 'resources', resourceCategory.name.toLowerCase()]);
    }

    onDeleteCategory() {
        this.resourceCategoryService.fetchResourceCategories();
        this.router.navigate(['', 'secure', 'configuration', 'resources']);
    }

    onNewResource() {
        this.resourceCategoryService.fetchResourceCategories();
    }

    onEditResource() {
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