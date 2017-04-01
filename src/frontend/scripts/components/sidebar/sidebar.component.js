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
var auth_service_1 = require("../../services/singleton/auth.service");
var router_1 = require("@angular/router");
var notification_service_1 = require("../../services/singleton/notification.service");
var loader_service_1 = require("../../services/singleton/loader.service");
var SidebarComponent = (function () {
    function SidebarComponent(authService, notificationService, loaderService, router) {
        this.authService = authService;
        this.notificationService = notificationService;
        this.loaderService = loaderService;
        this.router = router;
        this.reservationManagementLinks = [
            { icon: 'hourglass-half', label: 'Pending', path: ['', 'secure', 'management', 'pending'] },
            { icon: 'calendar-check-o', label: 'Approved', path: ['', 'secure', 'management', 'approved'] },
            { icon: 'calendar-times-o', label: 'Rejected', path: ['', 'secure', 'management', 'rejected'] },
            { icon: 'calendar', label: 'Calendar', path: ['', 'secure', 'management', 'calendar'] }
        ];
        this.configurationLinks = [
            { icon: 'tags', label: 'Resources', path: ['', 'secure', 'configuration', 'resources'] },
            { icon: 'user', label: 'Users', path: ['', 'secure', 'configuration', 'users'] },
            { icon: 'unlock', label: 'Permissions', path: ['', 'secure', 'configuration', 'permissions'] },
            { icon: 'cog', label: 'Properties', path: ['', 'secure', 'configuration', 'properties'] }
        ];
        this.myLinks = [
            { icon: 'pencil', label: 'My Account', path: ['', 'secure', 'my', 'account'] },
            { icon: 'bell', label: 'My Notifications', path: ['', 'secure', 'my', 'notifications'] }
        ];
        //noinspection JSMismatchedCollectionQueryUpdate
        /**
         * Contains the currently signed in user's unread notifications.
         */
        this.unreadNotifications = [];
        /**
         * This variable keeps track of when the user swipes the sidebar open or closed (on mobile devices)
         */
        this.swipedOpen = false;
    }
    SidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Get the user and their unread notifications
        this.authService.getUser().subscribe(function (user) {
            if (user) {
                _this.user = user;
                _this.notificationService.getUnreadNotifications().subscribe(function (unreadNotifications) {
                    _this.unreadNotifications = unreadNotifications;
                });
            }
        });
    };
    SidebarComponent.prototype.onSwipeRight = function () {
        this.swipedOpen = true;
    };
    SidebarComponent.prototype.onSwipeLeft = function () {
        this.swipedOpen = false;
    };
    SidebarComponent.prototype.onSignOut = function () {
        var _this = this;
        this.loaderService.startLoading();
        this.authService.signOut().subscribe(function (success) {
            _this.loaderService.stopLoading();
            _this.router.navigate(['', 'sign-in']);
        });
    };
    return SidebarComponent;
}());
SidebarComponent = __decorate([
    core_1.Component({
        selector: 'app-sidebar',
        templateUrl: 'sidebar.component.html',
        styleUrls: ['sidebar.component.css', 'sidebar.mobile.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        notification_service_1.NotificationService,
        loader_service_1.LoaderService,
        router_1.Router])
], SidebarComponent);
exports.SidebarComponent = SidebarComponent;
//# sourceMappingURL=sidebar.component.js.map