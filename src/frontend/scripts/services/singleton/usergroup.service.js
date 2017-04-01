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
var UserGroupService = (function () {
    function UserGroupService(apiService) {
        this.apiService = apiService;
        this.rootUserGroup = new rxjs_1.ReplaySubject(1);
        this.fetchRootUserGroup();
    }
    UserGroupService.prototype.fetchRootUserGroup = function () {
        var _this = this;
        this.apiService.get("userGroups").subscribe(function (response) { return _this.rootUserGroup.next(response); }, function (err) { return _this.rootUserGroup.error(err); });
    };
    UserGroupService.prototype.getRootUserGroup = function () {
        return this.rootUserGroup;
    };
    UserGroupService.prototype.getUserGroupById = function (id) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.get("userGroups/" + id)
                .subscribe(function (response) { return listener.next(response); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
        });
    };
    UserGroupService.prototype.getUsersByGroup = function (userGroup) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.get("userGroups/" + userGroup.id + "/users")
                .subscribe(function (response) { return listener.next(response); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
        });
    };
    UserGroupService.prototype.getResourcesByGroup = function (userGroup) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.get("userGroups/" + userGroup.id + "/resources")
                .subscribe(function (response) { return listener.next(response); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
        });
    };
    UserGroupService.prototype.getUserGroupHierarchyDown = function (userGroup) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.get("userGroups/hierarchyDown/" + userGroup.id).subscribe(function (response) { return listener.next(response); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
        });
    };
    UserGroupService.prototype.getUserGroupHierarchyUp = function (userGroup) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.get("/userGroups/hierarchyUp/" + userGroup.id).subscribe(function (response) { return listener.next(response); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
        });
    };
    /**
     * Adds a new User Group with the details provided in the provided UserGroup object.
     * @param userGroup The UserGroup containing the details of the new Group. ID is not required.
     * @returns The new UserGroup if it was created successfully, undefined otherwise.
     */
    UserGroupService.prototype.addNewUserGroup = function (userGroup) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            if (!userGroup)
                listener.next(false);
            else {
                _this.apiService.post("userGroups", userGroup).subscribe(function (response) { return listener.next(response); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
            }
        });
    };
    UserGroupService.prototype.patchUserGroup = function (userGroup) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            if (!userGroup)
                listener.error("User group was null.");
            else {
                _this.apiService.patch("userGroups/" + userGroup.id, userGroup).subscribe(function (response) { return listener.next(); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
            }
        });
    };
    UserGroupService.prototype.moveUserGroup = function (userGroup, newParentUserGroup) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.patch("userGroups/" + userGroup.id + "/move?newParentId=" + newParentUserGroup.id).subscribe(function (response) { return listener.next(); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
        });
    };
    UserGroupService.prototype.deleteUserGroup = function (userGroup) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.del("userGroups/" + userGroup.id)
                .subscribe(function (response) { return listener.next(); }, function (err) { return listener.error(err); }, function () { return listener.complete(); });
        });
    };
    return UserGroupService;
}());
UserGroupService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService])
], UserGroupService);
exports.UserGroupService = UserGroupService;
//# sourceMappingURL=usergroup.service.js.map