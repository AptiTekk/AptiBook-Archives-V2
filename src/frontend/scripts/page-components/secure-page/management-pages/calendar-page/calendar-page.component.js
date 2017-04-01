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
/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
var core_1 = require("@angular/core");
var usergroup_service_1 = require("../../../../services/singleton/usergroup.service");
var resource_category_service_1 = require("../../../../services/singleton/resource-category.service");
var reservation_info_modal_component_1 = require("../../../../components/reservation-info-modal/reservation-info-modal.component");
var auth_service_1 = require("../../../../services/singleton/auth.service");
var api_service_1 = require("../../../../services/singleton/api.service");
var CalendarPageComponent = (function () {
    function CalendarPageComponent(userGroupService, apiService, resourceCategoryService, authService) {
        this.userGroupService = userGroupService;
        this.apiService = apiService;
        this.resourceCategoryService = resourceCategoryService;
        this.authService = authService;
        this.filterOnlyUsersEvents = false;
    }
    CalendarPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Get user and hierarchy down
        this.authService.getUser().subscribe(function (user) {
            _this.currentUser = user;
            _this.userGroupOwnerFilter = [];
            if (user)
                user.userGroups.forEach(function (userGroup) {
                    _this.userGroupService.getUserGroupHierarchyDown(userGroup)
                        .take(1)
                        .subscribe(function (hierarchyGroups) {
                        return (_a = _this.userGroupOwnerFilter).push.apply(_a, hierarchyGroups);
                        var _a;
                    });
                });
        });
        // Get Resource Categories
        this.resourceCategoryService.getResourceCategories()
            .take(1)
            .subscribe(function (resourceCategories) {
            _this.resourceCategories = resourceCategories.map(function (category) {
                category['enabled'] = true;
                return category;
            });
        });
    };
    CalendarPageComponent.prototype.onCalendarEventClicked = function (event) {
        this.reservationInfoModal.display(event);
    };
    CalendarPageComponent.prototype.updateEnabledResourceCategories = function () {
        this.enabledResourceCategories = this.resourceCategories ? this.resourceCategories.filter(function (category) { return category['enabled']; }) : [];
    };
    return CalendarPageComponent;
}());
__decorate([
    core_1.ViewChild('reservationInfoModal'),
    __metadata("design:type", reservation_info_modal_component_1.ReservationInfoModalComponent)
], CalendarPageComponent.prototype, "reservationInfoModal", void 0);
CalendarPageComponent = __decorate([
    core_1.Component({
        selector: 'calendar-page',
        templateUrl: 'calendar-page.component.html'
    }),
    __metadata("design:paramtypes", [usergroup_service_1.UserGroupService,
        api_service_1.APIService,
        resource_category_service_1.ResourceCategoryService,
        auth_service_1.AuthService])
], CalendarPageComponent);
exports.CalendarPageComponent = CalendarPageComponent;
//# sourceMappingURL=calendar-page.component.js.map