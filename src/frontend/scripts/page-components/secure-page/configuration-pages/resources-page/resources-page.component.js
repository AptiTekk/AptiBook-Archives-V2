/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var resource_category_service_1 = require("../../../../services/singleton/resource-category.service");
var router_1 = require("@angular/router");
var api_service_1 = require("../../../../services/singleton/api.service");
var resource_service_1 = require("../../../../services/singleton/resource.service");
var usergroup_service_1 = require("../../../../services/singleton/usergroup.service");
var ResourcesPageComponent = (function () {
    function ResourcesPageComponent(router, route, apiService, resourceCategoryService, resourceService, userGroupService) {
        this.router = router;
        this.route = route;
        this.apiService = apiService;
        this.resourceCategoryService = resourceCategoryService;
        this.resourceService = resourceService;
        this.userGroupService = userGroupService;
    }
    ResourcesPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.resourceCategoryService.fetchResourceCategories();
        this.resourceCategoryService
            .getResourceCategories()
            .subscribe(function (resourceCategories) {
            _this.resourceCategories = resourceCategories;
            _this.route.params
                .subscribe(function (params) {
                var resourceCategoryName = params['resourceCategory'];
                if (resourceCategoryName) {
                    var filteredCategories = _this.resourceCategories.filter(function (resourceCategory) { return resourceCategory.name.toLowerCase() === resourceCategoryName.toLowerCase(); });
                    if (filteredCategories.length > 0) {
                        _this.currentResourceCategory = filteredCategories[0];
                        return;
                    }
                }
                _this.currentResourceCategory = _this.resourceCategories[0];
            });
        });
        this.userGroupService.getRootUserGroup().subscribe(function (rootGroup) { return _this.rootGroup = rootGroup; });
    };
    ResourcesPageComponent.prototype.onNewCategory = function (resourceCategory) {
        this.resourceCategoryService.fetchResourceCategories();
        this.router.navigate(['', 'secure', 'configuration', 'resources', resourceCategory.name.toLowerCase()]);
    };
    ResourcesPageComponent.prototype.onEditCategory = function (resourceCategory) {
        this.resourceCategoryService.fetchResourceCategories();
        this.router.navigate(['', 'secure', 'configuration', 'resources', resourceCategory.name.toLowerCase()]);
    };
    ResourcesPageComponent.prototype.onDeleteCategory = function () {
        this.resourceCategoryService.fetchResourceCategories();
        this.router.navigate(['', 'secure', 'configuration', 'resources']);
    };
    ResourcesPageComponent.prototype.onNewResource = function () {
        this.resourceCategoryService.fetchResourceCategories();
    };
    ResourcesPageComponent.prototype.onEditResource = function () {
        this.resourceCategoryService.fetchResourceCategories();
    };
    ResourcesPageComponent.prototype.onDeleteResource = function () {
        var _this = this;
        if (!this.resourceForDeletion)
            return;
        this.resourceService.deleteResource(this.resourceForDeletion).subscribe(function (response) {
            _this.resourceCategoryService.fetchResourceCategories();
        });
    };
    return ResourcesPageComponent;
}());
ResourcesPageComponent = __decorate([
    core_1.Component({
        selector: 'resources-page',
        templateUrl: 'resources-page.component.html',
        styleUrls: ['resources-page.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router,
        router_1.ActivatedRoute,
        api_service_1.APIService,
        resource_category_service_1.ResourceCategoryService,
        resource_service_1.ResourceService,
        usergroup_service_1.UserGroupService])
], ResourcesPageComponent);
exports.ResourcesPageComponent = ResourcesPageComponent;
//# sourceMappingURL=resources-page.component.js.map