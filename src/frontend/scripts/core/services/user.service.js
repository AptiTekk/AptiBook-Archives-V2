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
var UserService = (function () {
    function UserService(apiService) {
        this.apiService = apiService;
        this.users = new rxjs_1.ReplaySubject(1);
        this.fetchUsers();
    }
    UserService.prototype.fetchUsers = function () {
        var _this = this;
        this.apiService
            .get("/users")
            .take(1)
            .subscribe(function (response) { return _this.users.next(response); }, function (err) { return _this.users.next(undefined); });
    };
    UserService.prototype.getUsers = function () {
        return this.users;
    };
    UserService.prototype.addNewUser = function (user) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService
                .post("users", user)
                .subscribe(function (response) { return listener.next(response); }, function (err) { return listener.error(err); });
        });
    };
    UserService.prototype.patchUser = function (user, passwordOnly) {
        var _this = this;
        if (passwordOnly === void 0) { passwordOnly = false; }
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService
                .patch("users/" + user.id + (passwordOnly ? "?passwordOnly=true" : ""), user)
                .subscribe(function (response) { return listener.next(response); }, function (err) { return listener.error(err); });
        });
    };
    UserService.prototype.deleteUser = function (user) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService
                .del("users/" + user.id)
                .subscribe(function (response) { return listener.next(true); }, function (err) { return listener.error(err); });
        });
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map