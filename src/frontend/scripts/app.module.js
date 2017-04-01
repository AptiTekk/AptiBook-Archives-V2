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
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./page-components/app/app.component");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var components = require("./components");
var pageComponents = require("./page-components");
var singletons = require("./services/singleton");
var routes_1 = require("./routing/routes");
var guards = require("./routing/guards");
var pipes = require("./pipes");
var angular_vendors_1 = require("./vendors/angular-vendors");
var angular_vendors_2 = require("./vendors/angular-vendors");
var error_handler_1 = require("./error-handler");
var mapImports = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule,
            routes_1.routes
        ].concat(angular_vendors_1.vendorImports),
        providers: [
            {
                provide: core_1.ErrorHandler,
                useClass: error_handler_1.AptiBookErrorHandler
            }
        ].concat(mapImports(singletons), mapImports(guards)),
        declarations: mapImports(components).concat(mapImports(pageComponents), mapImports(pipes), angular_vendors_2.vendorComponents),
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map