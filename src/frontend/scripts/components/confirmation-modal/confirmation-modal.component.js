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
var modal_component_1 = require("../modal/modal.component");
var ConfirmationModalComponent = (function () {
    function ConfirmationModalComponent() {
        /**
         * Determines the title of the modal.
         * Defaults to "Confirmation".
         */
        this.title = "Confirmation";
        /**
         * The text to put inside the "Yes" button.
         * Defaults to "Yes".
         */
        this.yesButtonLabel = "Yes";
        /**
         * The color of the "Yes" button.
         * Valid choices are:
         * - primary (Blue)
         * - warning (Yellow)
         * - danger (Red)
         * - default (Grey)
         *
         * Defaults to "primary".
         */
        this.yesButtonColor = "primary";
        /**
         * The text to put inside the "No" button.
         * Defaults to "No".
         */
        this.noButtonLabel = "No";
        /**
         * The color of the "No" button.
         * Valid choices are:
         * - primary (Blue)
         * - warning (Yellow)
         * - danger (Red)
         * - default (Grey)
         *
         * Defaults to "default".
         */
        this.noButtonColor = "default";
        /**
         * Emitted when the user makes a decision.
         * The event will be a boolean; true for "Yes" and false for "No" (aka cancel).
         */
        this.decision = new core_1.EventEmitter();
    }
    /**
     * Opens the confirmation modal.
     */
    ConfirmationModalComponent.prototype.open = function () {
        this.modal.openModal();
    };
    /**
     * Called when the user clicks yes or no, or the modal is cancelled.
     */
    ConfirmationModalComponent.prototype.onDecision = function (decisionMade) {
        this.modal.closeModal();
        this.decision.emit(decisionMade);
    };
    return ConfirmationModalComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ConfirmationModalComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ConfirmationModalComponent.prototype, "yesButtonLabel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ConfirmationModalComponent.prototype, "yesButtonColor", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ConfirmationModalComponent.prototype, "noButtonLabel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ConfirmationModalComponent.prototype, "noButtonColor", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ConfirmationModalComponent.prototype, "decision", void 0);
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], ConfirmationModalComponent.prototype, "modal", void 0);
ConfirmationModalComponent = __decorate([
    core_1.Component({
        selector: 'confirmation-modal',
        templateUrl: 'confirmation-modal.component.html'
    })
], ConfirmationModalComponent);
exports.ConfirmationModalComponent = ConfirmationModalComponent;
//# sourceMappingURL=confirmation-modal.component.js.map