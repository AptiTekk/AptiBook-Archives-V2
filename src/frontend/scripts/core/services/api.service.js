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
var http_1 = require("@angular/http");
var rxjs_1 = require("rxjs");
var APIService = APIService_1 = (function () {
    function APIService(http) {
        this.http = http;
        this.tenantSlug = document.head.querySelector("[name=tenant]")['content'];
        this.apiUrl = "/api/" + this.tenantSlug + "/";
        this.headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }
    APIService.prototype.getApiUrlFromEndpoint = function (endpoint) {
        return this.apiUrl + APIService_1.removeTrailingSlash(endpoint);
    };
    APIService.checkForErrors = function (response) {
        if (response.status >= 200 && response.status < 300) {
            if (response.text().length > 0)
                return JSOG.parse(response.text());
            return undefined;
        }
        else {
            var error = new Error(response.statusText);
            error['response'] = response;
            throw error;
        }
    };
    APIService.removeTrailingSlash = function (path) {
        if (path && path.startsWith("/"))
            path = path.substring(1);
        return path;
    };
    APIService.prototype.get = function (path, additionalHeaders) {
        var options;
        if (additionalHeaders) {
            var newHeaders_1 = new http_1.Headers(this.headers);
            additionalHeaders.forEach(function (values, name) {
                values.forEach(function (value) { return newHeaders_1.append(name, value); });
            });
            options = new http_1.RequestOptions({ headers: newHeaders_1 });
        }
        else
            options = new http_1.RequestOptions({ headers: this.headers });
        return this.http.get("" + this.apiUrl + APIService_1.removeTrailingSlash(path), options)
            .map(APIService_1.checkForErrors)
            .catch(function (e) { return rxjs_1.Observable.throw(e.json().error); });
    };
    APIService.prototype.post = function (path, data) {
        var options = new http_1.RequestOptions({ headers: this.headers });
        return this.http.post("" + this.apiUrl + APIService_1.removeTrailingSlash(path), JSOG.stringify(data), options)
            .map(APIService_1.checkForErrors)
            .catch(function (e) { return rxjs_1.Observable.throw(e.json().error); });
    };
    APIService.prototype.put = function (path, data) {
        var options = new http_1.RequestOptions({ headers: this.headers });
        return this.http.put("" + this.apiUrl + APIService_1.removeTrailingSlash(path), JSOG.stringify(data), options)
            .map(APIService_1.checkForErrors)
            .catch(function (e) { return rxjs_1.Observable.throw(e.json().error); });
    };
    APIService.prototype.patch = function (path, data) {
        var options = new http_1.RequestOptions({ headers: this.headers });
        return this.http.patch("" + this.apiUrl + APIService_1.removeTrailingSlash(path), data != null ? JSOG.stringify(data) : undefined, options)
            .map(APIService_1.checkForErrors)
            .catch(function (e) { return rxjs_1.Observable.throw(e.json().error); });
    };
    APIService.prototype.del = function (path) {
        var options = new http_1.RequestOptions({ headers: this.headers });
        return this.http.delete("" + this.apiUrl + APIService_1.removeTrailingSlash(path), options)
            .map(APIService_1.checkForErrors)
            .catch(function (e) { return rxjs_1.Observable.throw(e.json().error); });
    };
    return APIService;
}());
APIService = APIService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], APIService);
exports.APIService = APIService;
var APIService_1;
//# sourceMappingURL=api.service.js.map