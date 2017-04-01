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
var http_1 = require("@angular/http");
var AuthService = (function () {
    function AuthService(apiService) {
        this.apiService = apiService;
        this.user = new rxjs_1.ReplaySubject(1);
        this.reloadUser();
    }
    /**
     * Forces a reload of the user from the REST API
     */
    AuthService.prototype.reloadUser = function () {
        var _this = this;
        this.apiService.get("auth/sign-in").subscribe(function (response) { return _this.user.next(response); }, function (err) { return _this.user.next(undefined); });
    };
    /**
     * @returns The User ReplaySubject which is updated infrequently.
     */
    AuthService.prototype.getUser = function () {
        return this.user;
    };
    /**
     * Signs the user into AptiBook using the credentials provided.
     * @param emailAddress The email address of the user.
     * @param password The password of the user.
     * @returns An observable that contains the object of the signed in User.
     */
    AuthService.prototype.signIn = function (emailAddress, password) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.get("auth/sign-in", new http_1.Headers({
                "Authorization": "Basic " + btoa(emailAddress + ":" + password)
            })).subscribe(function (response) {
                _this.user.next(response);
                listener.next(response);
            }, function (err) {
                _this.user.next(undefined);
                listener.error(err);
            });
        });
    };
    /**
     * Signs the user out of AptiBook
     * @returns An observable with no data.
     */
    AuthService.prototype.signOut = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.get("auth/sign-out").subscribe(function (response) {
                _this.user.next(undefined);
                listener.next();
            }, function (err) {
                listener.error(err);
            });
        });
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map