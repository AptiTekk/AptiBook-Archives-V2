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
/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
var core_1 = require("@angular/core");
var modal_component_1 = require("../modal/modal.component");
var DeletionConfirmationModalComponent = (function () {
    function DeletionConfirmationModalComponent() {
        this.confirm = new core_1.EventEmitter();
    }
    DeletionConfirmationModalComponent.prototype.open = function () {
        this.modal.openModal();
    };
    DeletionConfirmationModalComponent.prototype.onConfirm = function () {
        this.confirm.emit();
        this.modal.closeModal();
    };
    return DeletionConfirmationModalComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", modal_component_1.ModalComponent)
], DeletionConfirmationModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DeletionConfirmationModalComponent.prototype, "message", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DeletionConfirmationModalComponent.prototype, "warning", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DeletionConfirmationModalComponent.prototype, "confirm", void 0);
DeletionConfirmationModalComponent = __decorate([
    core_1.Component({
        selector: 'deletion-confirmation-modal',
        templateUrl: 'deletion-confirmation-modal.component.html'
    })
], DeletionConfirmationModalComponent);
exports.DeletionConfirmationModalComponent = DeletionConfirmationModalComponent;
//# sourceMappingURL=deletion-confirmation-modal.component.js.map