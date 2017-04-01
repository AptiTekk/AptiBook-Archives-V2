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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var UsersPageComponent = (function () {
    function UsersPageComponent() {
        this.sectionLinks = [
            { icon: 'user', label: 'All Users', path: ['', 'secure', 'configuration', 'users'], exact: true },
            { icon: 'sitemap', label: 'User Groups', path: ['', 'secure', 'configuration', 'users', 'groups'] }
        ];
    }
    return UsersPageComponent;
}());
UsersPageComponent = __decorate([
    core_1.Component({
        selector: 'users-page',
        templateUrl: 'users-page.component.html',
        styleUrls: ['users-page.component.css']
    })
], UsersPageComponent);
exports.UsersPageComponent = UsersPageComponent;
//# sourceMappingURL=users-page.component.js.map