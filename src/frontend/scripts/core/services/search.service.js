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
var resource_service_1 = require("./resource.service");
var rxjs_1 = require("rxjs");
var SearchService = (function () {
    function SearchService(resourceService) {
        this.resourceService = resourceService;
        this.searchResults = new rxjs_1.ReplaySubject(1);
        this.startTime = new rxjs_1.ReplaySubject(1);
        this.endTime = new rxjs_1.ReplaySubject(1);
        this.searchResults.next(undefined);
    }
    SearchService.prototype.searchForResources = function (start, end) {
        var _this = this;
        this.resourceService.fetchAvailableResources(start, end).take(1).subscribe(function (results) {
            _this.searchResults.next(results);
            _this.startTime.next(start);
            _this.endTime.next(end);
        });
    };
    SearchService.prototype.clearResults = function () {
        this.searchResults.next([]);
        this.startTime.next(undefined);
        this.endTime.next(undefined);
    };
    SearchService.prototype.getSearchResults = function () {
        return this.searchResults;
    };
    SearchService.prototype.getStartTime = function () {
        return this.startTime;
    };
    SearchService.prototype.getEndTime = function () {
        return this.endTime;
    };
    return SearchService;
}());
SearchService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [resource_service_1.ResourceService])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map