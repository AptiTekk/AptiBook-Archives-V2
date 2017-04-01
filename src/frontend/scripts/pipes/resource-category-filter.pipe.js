"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
var core_1 = require("@angular/core");
var ResourceCategoryFilterPipe = (function () {
    function ResourceCategoryFilterPipe() {
    }
    ResourceCategoryFilterPipe.prototype.transform = function (resources, resourceCategories) {
        var filteredResources = [];
        if (resources && resourceCategories) {
            var _loop_1 = function (category) {
                resources.forEach(function (resource) {
                    if (resource.resourceCategory.name === category.name && category.enabled) {
                        filteredResources.push(resource);
                    }
                });
            };
            for (var _i = 0, resourceCategories_1 = resourceCategories; _i < resourceCategories_1.length; _i++) {
                var category = resourceCategories_1[_i];
                _loop_1(category);
            }
        }
        return filteredResources;
    };
    return ResourceCategoryFilterPipe;
}());
ResourceCategoryFilterPipe = __decorate([
    core_1.Pipe({
        name: 'resourceCategoryFilter',
        pure: false
    })
], ResourceCategoryFilterPipe);
exports.ResourceCategoryFilterPipe = ResourceCategoryFilterPipe;
//# sourceMappingURL=resource-category-filter.pipe.js.map