/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Resource} from "../../models/resource.model";
import {ResourceCategory} from "../../models/resource-category.model";
import Moment = moment.Moment;
import moment = require("moment");
import {ResourceCategoryService} from "./resource-category.service";

@Injectable()
export class ResourceService {

    constructor(private apiService: APIService,
                private resourceCategoryService: ResourceCategoryService) {
    }

    /**
     * TODO: JAVADOCS
     * @param start
     * @param end
     * @returns {any}
     */
    getAvailableResources(start: Moment, end: Moment): Promise<Resource[]> {
        return this.apiService.get(
            "/resources/available"
            + "?start=" + start.clone().utc().format("YYYY-MM-DDTHH:mm")
            + "&end=" + end.clone().utc().format("YYYY-MM-DDTHH:mm")
        );
    }

    /**
     * Creates a new Resource under the given Resource Category.
     * @param resourceCategory The Resource Category that the new Resource belongs to.
     * @param resource The Resource being created. Should contain a name, owner, and whether it needs approval or not.
     * @returns The new Resource.
     */
    addNewResource(resourceCategory: ResourceCategory, resource: Resource): Promise<Resource> {
        return this.apiService.post(`/resourceCategories/${resourceCategory.id}/resources`, resource)
            .then(resource => {
                this.resourceCategoryService.fetchResourceCategories();
                return resource;
            });
    }

    /**
     * TODO: JAVADOCS
     * @param resource
     * @returns {any}
     */
    patchResource(resource: Resource): Promise<Resource> {
        return this.apiService.patch("/resources/" + resource.id, resource)
            .then(resource => {
                this.resourceCategoryService.fetchResourceCategories();
                return resource;
            });
    }

    /**
     * TODO: JAVADOCS
     * @param resource
     * @returns {any}
     */
    deleteResource(resource: Resource): Promise<any> {
        return this.apiService.del("/resources/" + resource.id)
            .then(() => {
                this.resourceCategoryService.fetchResourceCategories();
                return;
            });
    }

}