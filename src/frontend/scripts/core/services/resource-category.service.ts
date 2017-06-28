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

@Injectable()
export class ResourceCategoryService {
    private resourceCategories: ReplaySubject<ResourceCategory[]> = new ReplaySubject<ResourceCategory[]>(1);

    constructor(private authService: AuthService, private apiService: APIService) {
        this.fetchResourceCategories();
    }

    /**
     * TODO: JAVADOCS
     */
    fetchResourceCategories(): void {
        this.apiService.get("/resourceCategories").then(categories => this.resourceCategories.next(categories));
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