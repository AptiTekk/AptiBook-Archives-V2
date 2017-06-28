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
     * Subscription to getting route parameters.
     */
    routeSubscription: Subscription;

    /**
     * Subscription to getting resource categories.
     */
    categorySubscription: Subscription;

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
     * All the resource categories.
     */
    resourceCategories: ResourceCategory[];

    /**
     * The root user group.
     */
    allUserGroups: UserGroupHierarchy;

    /**
     * Links for use on the frontend category selection.
     */
    categoryLinks: NavigationLink[] = [];

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
        // Get category from route
        this.routeSubscription = this.route.params.subscribe(params => {
            this.resourceCategoryName = params['resourceCategory'] != null ? params['resourceCategory'].toLowerCase() : null;
            this.resourceCategoryService.fetchResourceCategories();
        });

        // Turn route param into category
        this.categorySubscription = this.resourceCategoryService
            .getResourceCategories()
            .subscribe(resourceCategories => {
                this.resourceCategories = resourceCategories;

                // Check if the user supplied a category name in the route.
                if (this.resourceCategoryName != null) {
                    // Name was supplied. Check if there is a category by that name.
                    let filteredCategories = resourceCategories.filter(category => category.name.toLowerCase() === this.resourceCategoryName);
                    if (filteredCategories.length == 0) {
                        // No category found, go to root.
                        this.router.navigate(['secure', 'configuration', 'resources']);
                    } else {
                        // Category found.

                        // Get the category that was found.
                        this.currentResourceCategory = filteredCategories[0];

                        // Configure the category links
                        this.categoryLinks = resourceCategories.map(category => {
                            return {
                                label: category.name,
                                path: ['', 'secure', 'configuration', 'resources', category.name.toLowerCase()]
                            }
                        });
                    }
                } else if (resourceCategories.length > 0) {
                    // No name supplied, but we have some categories, so go to the first category.
                    this.router.navigate(['secure', 'configuration', 'resources', resourceCategories[0].name.toLowerCase()]);
                }
            });

        this.userGroupService.getAllUserGroups().take(1).subscribe(allUserGroups => this.allUserGroups = allUserGroups);
    }

    ngOnDestroy(): void {
        if (this.routeSubscription != null)
            this.routeSubscription.unsubscribe();
        if (this.categorySubscription != null)
            this.categorySubscription.unsubscribe();
    }

    onNewCategory(resourceCategory: ResourceCategory) {
        AnalyticsService.sendEvent({
            category: 'Configuration - Resources',
            action: 'CreateCategory'
        });
        this.resourceCategoryService.fetchResourceCategories();
        this.router.navigate(['', 'secure', 'configuration', 'resources', resourceCategory.name.toLowerCase()]);
    }

    onEditCategory(resourceCategory: ResourceCategory) {
        AnalyticsService.sendEvent({
            category: 'Configuration - Resources',
            action: 'EditCategory'
        });
        this.resourceCategoryService.fetchResourceCategories();
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
                this.resourceCategoryService.fetchResourceCategories();
                this.router.navigate(['', 'secure', 'configuration', 'resources']);
            })
            .catch(err => this.loaderService.stopLoading())
    }

    onNewResource() {
        AnalyticsService.sendEvent({
            category: 'Configuration - Resources',
            action: 'CreateResource'
        });
        this.resourceCategoryService.fetchResourceCategories();
    }

    onEditResource() {
        AnalyticsService.sendEvent({
            category: 'Configuration - Resources',
            action: 'EditResource'
        });
        this.resourceCategoryService.fetchResourceCategories();
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
                this.resourceCategoryService.fetchResourceCategories();
            })
    }

}