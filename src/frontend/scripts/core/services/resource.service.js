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
var api_service_1 = require("./api.service");
var rxjs_1 = require("rxjs");
var ResourceService = (function () {
    function ResourceService(apiService) {
        this.apiService = apiService;
    }
    ResourceService.prototype.fetchAvailableResources = function (start, end) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService
                .get("/resources/available?start=" + start.clone().utc().format("YYYY-MM-DDTHH:mm") + "&end=" + end.clone().utc().format("YYYY-MM-DDTHH:mm"))
                .subscribe(function (resources) { return listener.next(resources); }, function (err) { return listener.next(undefined); });
        });
    };
    ResourceService.prototype.addNewResource = function (resourceCategory, name, needsApproval, owner) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService
                .post("/resources", { name: name, needsApproval: needsApproval, owner: owner, resourceCategory: resourceCategory })
                .subscribe(function (resources) { return listener.next(resources); }, function (err) { return listener.next(undefined); });
        });
    };
    ResourceService.prototype.patchResource = function (resource) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService
                .patch("/resources/" + resource.id, resource)
                .subscribe(function (response) { return listener.next(response); }, function (err) { return listener.next(undefined); });
        });
    };
    ResourceService.prototype.deleteResource = function (resource) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService
                .del("/resources/" + resource.id)
                .subscribe(function (response) { return listener.next(true); }, function (err) { return listener.next(false); });
        });
    };
    return ResourceService;
}());
ResourceService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService])
], ResourceService);
exports.ResourceService = ResourceService;
//# sourceMappingURL=resource.service.js.map