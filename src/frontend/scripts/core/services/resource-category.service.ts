/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {AuthService} from "./auth.service";
import {APIService} from "./api.service";
import {ResourceCategory, ResourceCategoryWithResources} from "../../models/resource-category.model";
import {Resource} from "../../models/resource.model";

@Injectable()
export class ResourceCategoryService {
    private resourceCategories = new ReplaySubject<ResourceCategoryWithResources[]>(1);

    constructor(private authService: AuthService, private apiService: APIService) {
        this.fetchResourceCategories();
    }

    /**
     * TODO: JAVADOCS
     */
    fetchResourceCategories(): void {
        //TODO: Fork join
        this.apiService.get("/resourceCategories").then((categories: ResourceCategoryWithResources[]) => {
            // Initialize Resources array for each Resource Category.
            categories.forEach(c => c.resources = []);

            // Fetch all the Resources and merge them with the Resource Categories.
            this.apiService.get("/resources").then((resources: Resource[]) => {
                resources.forEach(resource => {
                    let category = categories.find(category => category.id === resource.resourceCategory.id);
                    category.resources.push(resource);
                    resource.resourceCategory = category;
                })
            });

            // Emit the Resource Categories.
            this.resourceCategories.next(categories);
        });
    }

    /**
     * TODO: JAVADOCS
     * @returns {ReplaySubject<ResourceCategoryWithResources[]>}
     */
    getResourceCategories() {
        return this.resourceCategories;
    }

    /**
     * TODO: JAVADOCS
     * @param name
     * @returns {Promise<T>}
     */
    addNewResourceCategory(name: string): Promise<ResourceCategory> {
        return this.apiService.post("/resourceCategories", {name: name});
    }

    /**
     * TODO: JAVADOCS
     * @param category
     * @returns {any}
     */
    patchResourceCategory(category: ResourceCategory): Promise<ResourceCategory> {
        return this.apiService.patch("/resourceCategories/" + category.id, category);
    }

    /**
     * TODO: JAVADOCS
     * @param category
     * @returns {any}
     */
    deleteResourceCategory(category: ResourceCategory): Promise<any> {
        return this.apiService.del("/resourceCategories/" + category.id);
    }

}