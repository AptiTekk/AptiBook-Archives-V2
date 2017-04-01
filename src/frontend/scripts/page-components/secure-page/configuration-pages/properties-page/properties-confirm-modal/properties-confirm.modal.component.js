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
var modal_component_1 = require("../../../../../components/modal/modal.component");
var PropertiesConfirmModalComponent = (function () {
    function PropertiesConfirmModalComponent() {
        this.confirm = new core_1.EventEmitter();
    }
    PropertiesConfirmModalComponent.prototype.open = function () {
        this.modal.openModal();
    };
    PropertiesConfirmModalComponent.prototype.close = function () {
        this.modal.closeModal();
    };
    PropertiesConfirmModalComponent.prototype.onConfirm = function () {
        this.confirm.emit();
        this.modal.closeModal();
    };
    return PropertiesConfirmModalComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], PropertiesConfirmModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PropertiesConfirmModalComponent.prototype, "message", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], PropertiesConfirmModalComponent.prototype, "confirm", void 0);
PropertiesConfirmModalComponent = __decorate([
    core_1.Component({
        selector: 'properties-confirm-modal',
        templateUrl: 'properties-confirm.modal.component.html'
    })
], PropertiesConfirmModalComponent);
exports.PropertiesConfirmModalComponent = PropertiesConfirmModalComponent;
//# sourceMappingURL=properties-confirm.modal.component.js.map