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
var auth_service_1 = require("../../../../services/singleton/auth.service");
var notification_service_1 = require("../../../../services/singleton/notification.service");
var moment = require("moment");
var NotificationsPageComponent = (function () {
    function NotificationsPageComponent(authService, notificationService) {
        var _this = this;
        this.notifications = [];
        this.unreadNotifications = [];
        notificationService.reloadNotifications();
        notificationService.getNotifications().take(1).subscribe(function (notifications) {
            _this.notifications = notifications;
            notificationService.markAllRead();
        });
        notificationService.getUnreadNotifications().take(1).subscribe(function (unreadNotifications) {
            _this.unreadNotifications = unreadNotifications;
        });
    }
    //noinspection JSMethodCanBeStatic
    NotificationsPageComponent.prototype.getTimeAgo = function (unreadNotification) {
        if (unreadNotification != undefined && unreadNotification != null)
            return moment(unreadNotification.creation).fromNow();
    };
    //noinspection JSMethodCanBeStatic
    NotificationsPageComponent.prototype.getNotificationSubject = function (unreadNotification) {
        return unreadNotification.subject;
    };
    return NotificationsPageComponent;
}());
NotificationsPageComponent = __decorate([
    core_1.Component({
        selector: 'my-notifications-page',
        templateUrl: 'notifications-page.component.html',
        styleUrls: ['notifications-page.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService, notification_service_1.NotificationService])
], NotificationsPageComponent);
exports.NotificationsPageComponent = NotificationsPageComponent;
//# sourceMappingURL=notifications-page.component.js.map