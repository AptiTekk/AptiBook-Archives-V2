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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var api_service_1 = require("./services/api.service");
var help_service_1 = require("./services/help.service");
var email_service_1 = require("./services/email-service");
var auth_service_1 = require("./services/auth.service");
var properties_service_1 = require("./services/properties-service");
var oauth_service_1 = require("./services/oauth.service");
var notification_service_1 = require("./services/notification.service");
var reservation_details_service_1 = require("./services/reservation-details.service");
var resource_category_service_1 = require("./services/resource-category.service");
var reservation_management_service_1 = require("./services/reservation-management.service");
var search_service_1 = require("./services/search.service");
var usergroup_service_1 = require("./services/usergroup.service");
var user_service_1 = require("./services/user.service");
var registration_service_1 = require("./services/registration.service");
var reservation_service_1 = require("./services/reservation.service");
var tenant_service_1 = require("./services/tenant.service");
var resource_service_1 = require("./services/resource.service");
var loader_service_1 = require("./services/loader.service");
var CoreModule = (function () {
    function CoreModule(otherCoreModule) {
        if (otherCoreModule) {
            throw new Error("The Core Module was imported twice. It can only be imported once (in the root module)");
        }
    }
    return CoreModule;
}());
CoreModule = __decorate([
    core_1.NgModule({
        imports: [],
        exports: [],
        declarations: [],
        providers: [
            api_service_1.APIService,
            auth_service_1.AuthService,
            email_service_1.EmailService,
            help_service_1.HelpService,
            loader_service_1.LoaderService,
            notification_service_1.NotificationService,
            oauth_service_1.OAuthService,
            properties_service_1.PropertiesService,
            registration_service_1.RegistrationService,
            reservation_service_1.ReservationService,
            reservation_details_service_1.ReservationDetailsService,
            reservation_management_service_1.ReservationManagementService,
            resource_service_1.ResourceService,
            resource_category_service_1.ResourceCategoryService,
            search_service_1.SearchService,
            tenant_service_1.TenantService,
            user_service_1.UserService,
            usergroup_service_1.UserGroupService
        ],
    }),
    __param(0, core_1.Optional()), __param(0, core_1.SkipSelf()),
    __metadata("design:paramtypes", [CoreModule])
], CoreModule);
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map