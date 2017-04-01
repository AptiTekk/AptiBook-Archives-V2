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
var api_service_1 = require("../singleton/api.service");
var rxjs_1 = require("rxjs");
var OAuthService = (function () {
    function OAuthService(apiService) {
        this.apiService = apiService;
        this.googleOAuthUrl = new rxjs_1.ReplaySubject(1);
        this.reloadOAuthURLs();
    }
    /**
     * Forces a reload of the OAuth URLs.
     */
    OAuthService.prototype.reloadOAuthURLs = function () {
        var _this = this;
        //Reload Google URL
        this.apiService.get("/oauthUrl/google").subscribe(function (response) {
            _this.googleOAuthUrl.next(response.url);
        }, function (err) {
            _this.googleOAuthUrl.next(undefined);
        });
    };
    /**
     * A valid URL for authenticating with Google.
     * @returns {ReplaySubject<string>} A ReplaySubject containing either
     * the URL as a string or undefined if Google Sign In is disabled.
     */
    OAuthService.prototype.getGoogleOAuthUrl = function () {
        return this.googleOAuthUrl;
    };
    return OAuthService;
}());
OAuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService])
], OAuthService);
exports.OAuthService = OAuthService;
//# sourceMappingURL=oauth.service.js.map