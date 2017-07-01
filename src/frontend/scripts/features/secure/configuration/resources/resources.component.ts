/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {ResourceCategoryService} from "../../../../core/services/resource-category.service";
import {ResourceCategory} from "../../../../models/resource-category.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Resource} from "../../../../models/resource.model";
import {ResourceService} from "../../../../core/services/resource.service";
import {UserGroupHierarchy} from "../../../../models/user-group.model";
import {UserGroupService} from "../../../../core/services/user-group.service";
import {NavigationLink} from "../../../../shared/navigation/navigation-link.model";
import {Subscription} from "rxjs/Subscription";
import {LoaderService} from "../../../../core/services/loader.service";
import {AnalyticsService} from "../../../../core/services/analytics.service";

@Component({
    selector: 'at-configuration-resources',
    templateUrl: 'resources.component.html',
    styleUrls: ['resources.component.css']
})
export class ResourcesConfigurationComponent implements OnInit, OnDestroy {

    /**
     * All Observable subscriptions for this component.
     */
    subscriptions: Subscription[] = [];

    /**
     * All the resource categories.
     */
    resourceCategories: ResourceCategory[];

    /**
     * The name of the resource category being accessed, from the URL. (In lowercase)
     * Is not guaranteed to be a real category name; should be validated.
     */
    resourceCategoryName: string;

    /**
     * The resource category being accessed, if any.
     */
    currentResourceCategory: ResourceCategory;

    /**
     * The root User Group.
     */
    rootUserGroup: UserGroupHierarchy;

    /**
     * A temporary variable for keeping track of which resource is being deleted, if any.
     */
    resourceForDeletion: Resource;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private resourceCategoryService: ResourceCategoryService,
                private resourceService: ResourceService,
                private userGroupService: UserGroupService,
                private loaderService: LoaderService) {
    }

    ngOnInit(): void {
        // Get all the Resource Categories.
        this.subscriptions.push(
            this.resourceCategoryService.getResourceCategories()
                .subscribe(resourceCategories => {
                    this.resourceCategories = resourceCategories;
                    this.refreshResources();
                })
        );

        // Get the Resource Category Name from the URL params.
        this.subscriptions.push(
            this.route.params.subscribe(params => {
                this.resourceCategoryName = params['categoryName'] != null ? params['categoryName'].toLowerCase() : null;
                this.refreshResources();
            })
        );

        // Get the Root User Group to determine if any User Groups exist.
        // This is to warn the user and prevent them from creating Resources when no User Groups exist.
        this.userGroupService.getRootUserGroupHierarchy().take(1).subscribe(rootUserGroup => this.rootUserGroup = rootUserGroup);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    /**
     * Based on the array of Resource Categories and the current url parameter, determines which Resource Category is
     * currently selected. Afterwards, the Resources are loaded from the API.
     */
    refreshResources(): void {
        // Check for Resource Categories.
        if (this.resourceCategories == null || this.resourceCategories.length == 0) return;

        // Check for the Resource Category Name URL param.
        if (this.resourceCategoryName == null) {
            // If no name is supplied, then navigate to the first Resource Category.
            this.router.navigateByUrl(`/secure/configuration/resources/${this.resourceCategories[0].name.toLowerCase()}`);
            return;
        }

        // Look for a Resource Category with the given name.
        let resourceCategory = this.resourceCategories.find(c => c.name.toLowerCase() === this.resourceCategoryName);

        // Check if a Resource Category was found.
        if (resourceCategory == null) {
            // Since it was not found, we fall back to the first Resource Category.
            this.router.navigateByUrl(`/secure/configuration/resources/${this.resourceCategories[0].name.toLowerCase()}`);
            return;
        }

        // Assign the found Resource Category to the field.
        this.currentResourceCategory = resourceCategory;
    }

    onNewCategory(resourceCategory: ResourceCategory) {
        AnalyticsService.sendEvent({
            category: 'Configuration - Resources',
            action: 'CreateCategory'
        });
        this.router.navigate(['', 'secure', 'configuration', 'resources', resourceCategory.name.toLowerCase()]);
    }

    onEditCategory(resourceCategory: ResourceCategory) {
        AnalyticsService.sendEvent({
            category: 'Configuration - Resources',
            action: 'EditCategory'
        });
        this.router.navigate(['', 'secure', 'configuration', 'resources', resourceCategory.name.toLowerCase()]);
    }

    onDeleteCategory() {
        this.loaderService.startLoading();

        this.resourceCategoryService.deleteResourceCategory(this.currentResourceCategory)
            .then(response => {
                AnalyticsService.sendEvent({
                    category: 'Configuration - Resources',
                    action: 'DeleteCategory'
                });
                this.loaderService.stopLoading();
                this.router.navigate(['', 'secure', 'configuration', 'resources']);
            })
            .catch(err => this.loaderService.stopLoading())
    }

    onNewResource() {
        AnalyticsService.sendEvent({
            category: 'Configuration - Resources',
            action: 'CreateResource'
        });
    }

    onEditResource() {
        AnalyticsService.sendEvent({
            category: 'Configuration - Resources',
            action: 'EditResource'
        });
    }

    onDeleteResource() {
        if (!this.resourceForDeletion)
            return;

        this.resourceService.deleteResource(this.resourceForDeletion)
            .then(response => {
                AnalyticsService.sendEvent({
                    category: 'Configuration - Resources',
                    action: 'DeleteResource'
                });
            })
    }

}