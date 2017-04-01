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
var alert_component_1 = require("../../../components/alert/alert.component");
var router_1 = require("@angular/router");
var search_service_1 = require("../../../services/singleton/search.service");
var api_service_1 = require("../../../services/singleton/api.service");
var resource_category_service_1 = require("../../../services/singleton/resource-category.service");
var reservation_details_service_1 = require("../../../services/singleton/reservation-details.service");
var SearchResultsPageComponent = (function () {
    function SearchResultsPageComponent(searchService, apiService, router, resourceCategoryService, reservationDetailsService) {
        var _this = this;
        this.searchService = searchService;
        this.apiService = apiService;
        this.resourceCategoryService = resourceCategoryService;
        this.reservationDetailsService = reservationDetailsService;
        this.resourceCategories = [];
        this.router = router;
        searchService.getSearchResults().subscribe(function (resources) {
            _this.availableResources = resources;
        });
        searchService.getStartTime().subscribe(function (start) { return _this.start = start; });
        searchService.getEndTime().subscribe(function (end) { return _this.end = end; });
        this.resourceCategoryService.getResourceCategories().take(1).subscribe(function (resourceCategory) {
            _this.resourceCategories = resourceCategory.map(function (category) {
                category['enabled'] = true;
                return category;
            });
        });
    }
    SearchResultsPageComponent.prototype.onSearch = function () {
        var _this = this;
        this.searchService.searchForResources(this.start, this.end);
        this.searchService.getSearchResults().take(1).subscribe(function (resources) { return _this.resultsUpdatedAlert.display(); });
    };
    SearchResultsPageComponent.prototype.reserve = function (resource) {
        this.reservationDetailsService.setResource(resource);
        this.router.navigateByUrl("/secure/search-results/reservation-details");
    };
    return SearchResultsPageComponent;
}());
__decorate([
    core_1.ViewChild("resultsUpdatedAlert"),
    __metadata("design:type", alert_component_1.AlertComponent)
], SearchResultsPageComponent.prototype, "resultsUpdatedAlert", void 0);
SearchResultsPageComponent = __decorate([
    core_1.Component({
        selector: 'search-results-page',
        templateUrl: 'search-results-page.component.html',
        styleUrls: ['search-results-page.component.css']
    }),
    __metadata("design:paramtypes", [search_service_1.SearchService, api_service_1.APIService, router_1.Router, resource_category_service_1.ResourceCategoryService, reservation_details_service_1.ReservationDetailsService])
], SearchResultsPageComponent);
exports.SearchResultsPageComponent = SearchResultsPageComponent;
//# sourceMappingURL=search-results-page.component.js.map