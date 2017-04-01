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
var rxjs_1 = require("rxjs");
var auth_service_1 = require("./auth.service");
var api_service_1 = require("./api.service");
var ResourceCategoryService = (function () {
    function ResourceCategoryService(authService, apiService) {
        this.authService = authService;
        this.apiService = apiService;
        this.resourceCategories = new rxjs_1.ReplaySubject(1);
        this.fetchResourceCategories();
    }
    ResourceCategoryService.prototype.fetchResourceCategories = function () {
        var _this = this;
        this.apiService.get("/resourceCategories").subscribe(function (response) { return _this.resourceCategories.next(response); }, function (err) { return _this.resourceCategories.next(undefined); });
    };
    ResourceCategoryService.prototype.getResourceCategories = function () {
        return this.resourceCategories;
    };
    ResourceCategoryService.prototype.addNewResourceCategory = function (name) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.post("/resourceCategories", { name: name }).subscribe(function (response) { return listener.next(response); }, function (err) { return listener.next(undefined); });
        });
    };
    ResourceCategoryService.prototype.patchResourceCategory = function (category) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.patch("/resourceCategories/" + category.id, category).subscribe(function (response) { return listener.next(response); }, function (err) { return listener.next(undefined); });
        });
    };
    ResourceCategoryService.prototype.deleteResourceCategory = function (category) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.del("/resourceCategories/" + category.id).subscribe(function (response) { return listener.next(true); }, function (err) { return listener.next(false); });
        });
    };
    return ResourceCategoryService;
}());
ResourceCategoryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService, api_service_1.APIService])
], ResourceCategoryService);
exports.ResourceCategoryService = ResourceCategoryService;
//# sourceMappingURL=resource-category.service.js.map