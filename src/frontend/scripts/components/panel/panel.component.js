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
var panel_footer_component_1 = require("./panel-footer/panel-footer.component");
var PanelComponent = (function () {
    function PanelComponent() {
        this.type = 'default';
    }
    return PanelComponent;
}());
__decorate([
    core_1.ContentChildren(panel_footer_component_1.PanelFooterComponent),
    __metadata("design:type", core_1.QueryList)
], PanelComponent.prototype, "footer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PanelComponent.prototype, "type", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PanelComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PanelComponent.prototype, "panelClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PanelComponent.prototype, "panelBodyClass", void 0);
PanelComponent = __decorate([
    core_1.Component({
        selector: 'panel',
        templateUrl: 'panel.component.html',
        styleUrls: ['panel.component.css']
    })
], PanelComponent);
exports.PanelComponent = PanelComponent;
//# sourceMappingURL=panel.component.js.map