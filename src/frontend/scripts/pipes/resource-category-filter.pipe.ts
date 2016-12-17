/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Pipe, PipeTransform} from "@angular/core";
import {Resource} from "../models/resource.model";

@Pipe({
    name: 'resourceCategoryFilter',
    pure: false
})
export class ResourceCategoryFilterPipe implements PipeTransform {

    transform(resources: any[], resourceCategories: any[]): any {
        let filteredResources: Resource[] = [];

        if (resources && resourceCategories) {
            for (let category of resourceCategories) {
                resources.forEach(resource => {
                    if (resource.resourceCategory.name === category.name && category.enabled) {
                        filteredResources.push(resource);
                    }
                })
            }
        }

        return filteredResources;
    }
}