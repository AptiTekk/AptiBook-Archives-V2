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
var forms_1 = require("@angular/forms");
var UUIDGenerator_1 = require("../../utils/UUIDGenerator");
var FormGroupComponent = (function () {
    function FormGroupComponent() {
        this.autoFocus = false;
        this.readOnly = false;
        this.uuid = UUIDGenerator_1.UUIDGenerator.generateUUID();
    }
    FormGroupComponent.prototype.getErrorMessage = function () {
        if (this.errorMessages && this.control) {
            var errors = this.control.errors;
            if (errors) {
                for (var errorName in this.errorMessages) {
                    if (this.errorMessages.hasOwnProperty(errorName)) {
                        if (errorName in errors)
                            return this.errorMessages[errorName];
                    }
                }
            }
        }
        return undefined;
    };
    return FormGroupComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormControl)
], FormGroupComponent.prototype, "control", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FormGroupComponent.prototype, "errorMessages", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FormGroupComponent.prototype, "label", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FormGroupComponent.prototype, "inputType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FormGroupComponent.prototype, "placeholder", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FormGroupComponent.prototype, "value", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], FormGroupComponent.prototype, "autoFocus", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], FormGroupComponent.prototype, "readOnly", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FormGroupComponent.prototype, "faIconName", void 0);
FormGroupComponent = __decorate([
    core_1.Component({
        selector: 'form-group',
        templateUrl: 'form-group.component.html'
    })
], FormGroupComponent);
exports.FormGroupComponent = FormGroupComponent;
//# sourceMappingURL=form-group.component.js.map