/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {AuthService} from "./auth.service";
import {APIService} from "./api.service";
import {ResourceCategory} from "../../models/resource-category.model";
import {Resource} from "../../models/resource.model";

@Injectable()
export class ResourceCategoryService {
    private resourceCategories = new ReplaySubject<ResourceCategory[]>(1);

    constructor(private apiService: APIService) {
    }

    /**
     * TODO: JAVADOCS
     */
    fetchResourceCategories(): void {
        this.apiService.get("/resourceCategories").then((categories: ResourceCategory[]) => {

            // Link each Resource to its Resource Category.
            categories.forEach(c => {
                c.resources.forEach(r => {
                    r.resourceCategory = c;
                })
            });

            // Emit the Resource Categories.
            this.resourceCategories.next(categories);
        });
    }

    /**
     * TODO: JAVADOCS
     * @returns {ReplaySubject<ResourceCategory[]>}
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
        return this.apiService.post("/resourceCategories", {name: name})
            .then(resourceCategory => {
                this.fetchResourceCategories();
                return resourceCategory;
            });
    }

    /**
     * TODO: JAVADOCS
     * @param category
     * @returns {any}
     */
    patchResourceCategory(category: ResourceCategory): Promise<ResourceCategory> {
        return this.apiService.patch("/resourceCategories/" + category.id, category)
            .then(resourceCategory => {
                this.fetchResourceCategories();
                return resourceCategory;
            });
    }

    /**
     * TODO: JAVADOCS
     * @param category
     * @returns {any}
     */
    deleteResourceCategory(category: ResourceCategory): Promise<any> {
        return this.apiService.del("/resourceCategories/" + category.id)
            .then(() => {
                this.fetchResourceCategories();
                return;
            });
    }

}