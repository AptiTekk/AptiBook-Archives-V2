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
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
var search_service_1 = require("../../services/singleton/search.service");
var SearchGuard = (function () {
    function SearchGuard(searchService, router) {
        this.searchService = searchService;
        this.router = router;
    }
    SearchGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.searchService.getSearchResults().take(1).subscribe(function (results) {
                if (results) {
                    listener.next(true);
                }
                else {
                    _this.router.navigate(['', 'secure']);
                    listener.next(false);
                }
            });
        }).take(1);
    };
    return SearchGuard;
}());
SearchGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [search_service_1.SearchService, router_1.Router])
], SearchGuard);
exports.SearchGuard = SearchGuard;
//# sourceMappingURL=search.guard.js.map