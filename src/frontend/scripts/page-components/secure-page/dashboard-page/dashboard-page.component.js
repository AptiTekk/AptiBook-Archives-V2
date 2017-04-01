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
var api_service_1 = require("../../../services/singleton/api.service");
var reservation_info_modal_component_1 = require("../../../components/reservation-info-modal/reservation-info-modal.component");
var auth_service_1 = require("../../../services/singleton/auth.service");
var resource_category_service_1 = require("../../../services/singleton/resource-category.service");
var router_1 = require("@angular/router");
var calendar_component_1 = require("../../../components/calendar/calendar.component");
var DashboardPageComponent = (function () {
    function DashboardPageComponent(apiService, authService, resourceCategoryService, activatedRoute) {
        this.apiService = apiService;
        this.authService = authService;
        this.resourceCategoryService = resourceCategoryService;
        this.activatedRoute = activatedRoute;
        this.filterOnlyUsersEvents = false;
    }
    DashboardPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Get the currently signed in user.
        this.authService.getUser().subscribe(function (user) { return _this.currentUser = user; });
        // Get all the resource categories for the calendar filters.
        this.resourceCategoryService.getResourceCategories().take(1).subscribe(function (resourceCategories) {
            _this.resourceCategories = resourceCategories.map(function (category) {
                category['enabled'] = true;
                return category;
            });
        });
    };
    /**
     * Called when an event on the calendar is clicked.
     * @param event The reservation that was clicked.
     */
    DashboardPageComponent.prototype.onCalendarEventClicked = function (event) {
        this.reservationInfoModal.display(event);
    };
    /**
     * Ensures that the resource categories are never undefined, only an empty array.
     */
    DashboardPageComponent.prototype.updateEnabledResourceCategories = function () {
        this.enabledResourceCategories = this.resourceCategories ? this.resourceCategories.filter(function (category) { return category['enabled']; }) : [];
    };
    return DashboardPageComponent;
}());
__decorate([
    core_1.ViewChild('reservationInfoModal'),
    __metadata("design:type", reservation_info_modal_component_1.ReservationInfoModalComponent)
], DashboardPageComponent.prototype, "reservationInfoModal", void 0);
__decorate([
    core_1.ViewChild(calendar_component_1.CalendarComponent),
    __metadata("design:type", calendar_component_1.CalendarComponent)
], DashboardPageComponent.prototype, "calendar", void 0);
DashboardPageComponent = __decorate([
    core_1.Component({
        selector: 'dashboard-page',
        templateUrl: 'dashboard-page.component.html'
    }),
    __metadata("design:paramtypes", [api_service_1.APIService,
        auth_service_1.AuthService,
        resource_category_service_1.ResourceCategoryService,
        router_1.ActivatedRoute])
], DashboardPageComponent);
exports.DashboardPageComponent = DashboardPageComponent;
//# sourceMappingURL=dashboard-page.component.js.map