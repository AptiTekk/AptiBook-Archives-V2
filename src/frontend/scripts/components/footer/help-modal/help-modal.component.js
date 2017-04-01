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
var modal_component_1 = require("../../modal/modal.component");
var singleton_1 = require("../../../services/singleton");
var HelpModalComponent = (function () {
    function HelpModalComponent(helpService) {
        this.helpService = helpService;
    }
    HelpModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.helpService.getCurrentHelpTopics().subscribe(function (helpTopics) { return _this.helpTopics = helpTopics; });
    };
    HelpModalComponent.prototype.openModal = function () {
        this.modal.openModal();
    };
    //noinspection JSMethodCanBeStatic
    HelpModalComponent.prototype.onVisitKnowledgebase = function () {
        var win = window.open('https://support.aptitekk.com/', '_blank');
        if (win) {
            win.focus();
        }
        else {
            alert('The Knowledgebase could not be opened. Please allow popups for this website.');
        }
    };
    return HelpModalComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", modal_component_1.ModalComponent)
], HelpModalComponent.prototype, "modal", void 0);
HelpModalComponent = __decorate([
    core_1.Component({
        selector: 'help-modal',
        templateUrl: 'help-modal.component.html'
    }),
    __metadata("design:paramtypes", [singleton_1.HelpService])
], HelpModalComponent);
exports.HelpModalComponent = HelpModalComponent;
//# sourceMappingURL=help-modal.component.js.map