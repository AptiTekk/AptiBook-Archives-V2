/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Resource} from "../../models/resource.model";
import {ResourceCategory} from "../../models/resource-category.model";
import {UserGroup} from "../../models/user-group.model";
import Moment = moment.Moment;
import moment = require("moment");

@Injectable()
export class ResourceService {

    constructor(private apiService: APIService) {
    }

    /**
     * TODO: JAVADOCS
     * @param start
     * @param end
     * @returns {any}
     */
    fetchAvailableResources(start: Moment, end: Moment): Promise<Resource[]> {
        return this.apiService.get(
            "/resources/available"
            + "?start=" + start.clone().utc().format("YYYY-MM-DDTHH:mm")
            + "&end=" + end.clone().utc().format("YYYY-MM-DDTHH:mm")
        );
    }

    /**
     * TODO: JAVADOCS
     * @param resourceCategory
     * @param name
     * @param needsApproval
     * @param owner
     * @returns {any}
     */
    addNewResource(resourceCategory: ResourceCategory, name: string, needsApproval: boolean, owner: UserGroup): Promise<Resource> {
        return this.apiService.post("/resources", {name, needsApproval, owner, resourceCategory});
    }

    /**
     * TODO: JAVADOCS
     * @param resource
     * @returns {any}
     */
    patchResource(resource: Resource): Promise<Resource> {
        return this.apiService.patch("/resources/" + resource.id, resource);
    }

    /**
     * TODO: JAVADOCS
     * @param resource
     * @returns {any}
     */
    deleteResource(resource: Resource): Promise<any> {
        return this.apiService.del("/resources/" + resource.id);
    }

}