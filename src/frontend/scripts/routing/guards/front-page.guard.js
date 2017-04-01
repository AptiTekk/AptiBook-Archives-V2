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
var auth_service_1 = require("../../services/singleton/auth.service");
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
var core_1 = require("@angular/core");
var tenant_service_1 = require("../../services/singleton/tenant.service");
var FrontPageGuard = (function () {
    function FrontPageGuard(authService, tenantService, router) {
        this.authService = authService;
        this.tenantService = tenantService;
        this.router = router;
    }
    FrontPageGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.tenantService.getTenant().take(1).subscribe(function (tenant) {
                if (tenant) {
                    _this.authService.getUser().take(1).subscribe(function (user) {
                        if (user) {
                            _this.router.navigate(['', 'secure']);
                            listener.next(false);
                        }
                        else {
                            listener.next(true);
                        }
                    });
                }
                else {
                    _this.router.navigate(['', 'inactive'], { skipLocationChange: true });
                    listener.next(false);
                }
            });
        }).take(1);
    };
    return FrontPageGuard;
}());
FrontPageGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        tenant_service_1.TenantService,
        router_1.Router])
], FrontPageGuard);
exports.FrontPageGuard = FrontPageGuard;
//# sourceMappingURL=front-page.guard.js.map