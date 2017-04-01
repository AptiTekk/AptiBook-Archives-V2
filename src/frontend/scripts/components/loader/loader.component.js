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
var loader_service_1 = require("../../services/singleton/loader.service");
var LoaderComponent = (function () {
    function LoaderComponent(loaderService) {
        var _this = this;
        loaderService.isLoading().subscribe(function (loading) { return _this.loading = loading; });
    }
    return LoaderComponent;
}());
LoaderComponent = __decorate([
    core_1.Component({
        selector: 'loader',
        templateUrl: 'loader.component.html',
        styleUrls: ['loader.component.css']
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService])
], LoaderComponent);
exports.LoaderComponent = LoaderComponent;
//# sourceMappingURL=loader.component.js.map