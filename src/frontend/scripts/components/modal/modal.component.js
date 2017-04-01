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
var ModalComponent = (function () {
    function ModalComponent() {
        /**
         * The size of the modal.
         * Valid options are: "sm", "md", "lg".
         * Default is "md".
         */
        this.size = "md";
        /**
         * Whether or not the modal should close when the user presses the ESC key.
         * Defaults to true.
         */
        this.closeOnEscape = true;
        /**
         * Whether or not the modal should close when the user clicks outside the modal.
         * Defaults to true.
         */
        this.closeOnOutsideClick = true;
        /**
         * Whether or not to hide the "X" close button in the top right corner of the modal.
         * Defaults to false;
         */
        this.hideCloseButton = false;
        /**
         * Determines whether the submit button is greyed out (disabled), assuming that the submit button exists.
         * Defaults to false.
         */
        this.submitButtonDisabled = false;
        /**
         * Emits when the user clicks the submit button, if it exists.
         */
        this.onSubmit = new core_1.EventEmitter();
        /**
         * Emits when the user clicks the cancel button, if it exists.
         * Also emitted when the user closes the modal by other means (ESC, X button, click outside modal).
         */
        this.onCancel = new core_1.EventEmitter();
        /**
         * Emits when the user clicks the danger button, if it exists.
         */
        this.onDangerSubmit = new core_1.EventEmitter();
        /**
         * Determines if the modal should be displayed or not.
         */
        this.isOpen = false;
    }
    ModalComponent.prototype.ngOnInit = function () {
        this.createBackdrop();
    };
    /**
     * Creates the backdrop element that displays behind the modal.
     */
    ModalComponent.prototype.createBackdrop = function () {
        this.backdropElement = document.createElement("div");
        this.backdropElement.classList.add("modal-backdrop");
        this.backdropElement.classList.add("fade");
        this.backdropElement.classList.add("in");
    };
    /**
     * Displays the modal.
     */
    ModalComponent.prototype.openModal = function () {
        var _this = this;
        if (this.isOpen)
            return;
        this.isOpen = true;
        document.body.appendChild(this.backdropElement);
        window.setTimeout(function () { return _this.modalRoot.nativeElement.focus(); }, 0);
        document.body.classList.add("modal-open");
    };
    /**
     * Closes the modal without emitting the onCancel emitter.
     */
    ModalComponent.prototype.closeModal = function () {
        if (!this.isOpen)
            return;
        this.isOpen = false;
        document.body.removeChild(this.backdropElement);
        document.body.classList.remove("modal-open");
    };
    /**
     * Closes the modal and emits the onCancel emitter.
     */
    ModalComponent.prototype.cancel = function () {
        this.closeModal();
        this.onCancel.next();
    };
    /**
     * Determines if the modal is oepn or not.
     * @returns True if the modal is open, false otherwise.
     */
    ModalComponent.prototype.isModalOpen = function () {
        return this.isOpen;
    };
    return ModalComponent;
}());
__decorate([
    core_1.ViewChild("modalRoot"),
    __metadata("design:type", core_1.ElementRef)
], ModalComponent.prototype, "modalRoot", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalComponent.prototype, "size", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalComponent.prototype, "closeOnEscape", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalComponent.prototype, "closeOnOutsideClick", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalComponent.prototype, "hideCloseButton", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalComponent.prototype, "cancelButtonLabel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalComponent.prototype, "submitButtonLabel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalComponent.prototype, "submitButtonDisabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalComponent.prototype, "dangerSubmitButtonLabel", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ModalComponent.prototype, "onSubmit", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ModalComponent.prototype, "onCancel", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ModalComponent.prototype, "onDangerSubmit", void 0);
ModalComponent = __decorate([
    core_1.Component({
        selector: 'modal',
        templateUrl: 'modal.component.html',
        styleUrls: ['modal.component.css']
    }),
    __metadata("design:paramtypes", [])
], ModalComponent);
exports.ModalComponent = ModalComponent;
var ModalComponentBody = (function () {
    function ModalComponentBody() {
    }
    return ModalComponentBody;
}());
ModalComponentBody = __decorate([
    core_1.Directive({
        selector: 'modal-body'
    })
], ModalComponentBody);
exports.ModalComponentBody = ModalComponentBody;
var ModalComponentFooter = (function () {
    function ModalComponentFooter() {
    }
    return ModalComponentFooter;
}());
ModalComponentFooter = __decorate([
    core_1.Directive({
        selector: 'modal-footer'
    })
], ModalComponentFooter);
exports.ModalComponentFooter = ModalComponentFooter;
//# sourceMappingURL=modal.component.js.map