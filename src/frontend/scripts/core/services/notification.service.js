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
var auth_service_1 = require("./auth.service");
var NotificationService = (function () {
    function NotificationService(apiService, authService) {
        var _this = this;
        this.apiService = apiService;
        this.authService = authService;
        this.notifications = new rxjs_1.ReplaySubject(1);
        this.unreadNotifications = new rxjs_1.ReplaySubject(1);
        this.readNotifications = new rxjs_1.ReplaySubject(1);
        this.authService.getUser().subscribe(function (user) {
            if (user != undefined) {
                _this.user = user;
                _this.reloadNotifications();
            }
        });
    }
    NotificationService.prototype.getNotifications = function () {
        return this.notifications;
    };
    NotificationService.prototype.getUnreadNotifications = function () {
        return this.unreadNotifications;
    };
    NotificationService.prototype.getReadNotifications = function () {
        return this.readNotifications;
    };
    NotificationService.prototype.reloadNotifications = function () {
        var _this = this;
        this.apiService.get("notifications/user/" + this.user.id).subscribe(function (response) {
            var notifications = response;
            _this.notifications.next(notifications);
            _this.unreadNotifications.next(notifications.filter(function (n) { return !n.read; }));
            _this.readNotifications.next(notifications.filter(function (n) { return n.read; }));
        }, function (err) {
            _this.notifications.next([]);
            _this.unreadNotifications.next([]);
            _this.readNotifications.next([]);
        });
    };
    NotificationService.prototype.markAllRead = function () {
        var _this = this;
        this.apiService.patch("notifications/user/" + this.user.id + "/markRead").subscribe(function (response) {
            var notifications = response;
            _this.notifications.next(notifications);
            _this.unreadNotifications.next(notifications.filter(function (n) { return !n.read; }));
            _this.readNotifications.next(notifications.filter(function (n) { return n.read; }));
        }, function (err) {
            _this.notifications.next([]);
            _this.unreadNotifications.next([]);
            _this.readNotifications.next([]);
        });
    };
    return NotificationService;
}());
NotificationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService, auth_service_1.AuthService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map