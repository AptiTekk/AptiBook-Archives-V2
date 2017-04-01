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
var auth_service_1 = require("../../services/singleton/auth.service");
var router_1 = require("@angular/router");
var notification_service_1 = require("../../services/singleton/notification.service");
var HeaderComponent = (function () {
    function HeaderComponent(router, authService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.notificationService = notificationService;
        this.unreadNotifications = [];
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getUser().subscribe(function (user) {
            if (user) {
                _this.user = user;
                _this.notificationService.getUnreadNotifications().subscribe(function (unreadNotifications) {
                    _this.unreadNotifications = unreadNotifications;
                });
            }
        });
    };
    HeaderComponent.prototype.onSignOut = function () {
        var _this = this;
        this.authService.signOut().subscribe(function (response) { return _this.router.navigate(['', 'sign-in']); });
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    core_1.Component({
        selector: 'app-header',
        templateUrl: 'header.component.html',
        styleUrls: ['header.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router,
        auth_service_1.AuthService,
        notification_service_1.NotificationService])
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map