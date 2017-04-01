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
var HelpService = HelpService_1 = (function () {
    function HelpService(router) {
        this.router = router;
        this.currentHelpTopicsObservable = rxjs_1.Observable.create(function (listener) {
            router.events.subscribe(function (value) {
                //Navigation has finished
                if (value instanceof router_1.NavigationEnd) {
                    //Get current url
                    var currentRoute = value.urlAfterRedirects;
                    //Determine which topics to send
                    var topics = void 0;
                    for (var _i = 0, _a = HelpService_1.HELP_DEFINITIONS; _i < _a.length; _i++) {
                        var definition = _a[_i];
                        if (definition.route === currentRoute)
                            topics = definition.topics;
                    }
                    //Notify listener
                    listener.next(topics);
                }
            });
        });
    }
    /**
     * Gets the help topics that are available for the current page.
     * @returns An observable that can be subscribed to and will automatically update with the current help topics.
     */
    HelpService.prototype.getCurrentHelpTopics = function () {
        return this.currentHelpTopicsObservable;
    };
    return HelpService;
}());
//noinspection JSMismatchedCollectionQueryUpdate
HelpService.HELP_DEFINITIONS = [];
HelpService = HelpService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router])
], HelpService);
exports.HelpService = HelpService;
var HelpService_1;
//# sourceMappingURL=help.service.js.map