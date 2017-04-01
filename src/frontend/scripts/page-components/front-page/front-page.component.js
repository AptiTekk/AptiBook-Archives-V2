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
var tenant_service_1 = require("../../services/singleton/tenant.service");
var oauth_service_1 = require("../../services/stateful/oauth.service");
var FrontPageComponent = (function () {
    function FrontPageComponent(tenantService) {
        this.tenantService = tenantService;
    }
    FrontPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.tenantService.getTenant().subscribe(function (response) { return _this.tenant = response; });
    };
    return FrontPageComponent;
}());
FrontPageComponent = __decorate([
    core_1.Component({
        selector: 'front-page',
        templateUrl: 'front-page.component.html',
        styleUrls: ['front-page.component.css'],
        providers: [oauth_service_1.OAuthService]
    }),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], FrontPageComponent);
exports.FrontPageComponent = FrontPageComponent;
//# sourceMappingURL=front-page.component.js.map