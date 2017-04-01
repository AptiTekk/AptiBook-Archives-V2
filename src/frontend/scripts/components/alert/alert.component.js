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
var rxjs_1 = require("rxjs");
var AlertComponent = (function () {
    function AlertComponent() {
        this.timerRunning = false;
        this.displayed = false;
        /**
         * Determines the color of the alert. May be one of 'info', 'danger', 'warning', and 'success'.
         * Defaults to 'info'.
         */
        this.severity = "info";
        this.autoCloseDelay = 2000;
        this.onAutoClose = new core_1.EventEmitter();
    }
    /**
     * Starts the autoClose timer if it is enabled
     */
    AlertComponent.prototype.startTimer = function () {
        var _this = this;
        this.timerRunning = true;
        this.visibilityTimer = rxjs_1.Observable.timer(this.autoCloseDelay).subscribe(function (i) {
            _this.onAutoClose.next();
            _this.stopTimer();
        });
    };
    /**
     * Stops the running autoClose timer if it exists.
     */
    AlertComponent.prototype.stopTimer = function () {
        this.timerRunning = false;
        if (this.visibilityTimer != undefined) {
            this.visibilityTimer.unsubscribe();
            this.visibilityTimer = undefined;
        }
    };
    AlertComponent.prototype.display = function (message, autoClose) {
        if (autoClose === void 0) { autoClose = true; }
        if (message) {
            this.message = message;
        }
        if (this.message) {
            if (autoClose) {
                this.displayed = false;
                this.stopTimer();
                this.startTimer();
            }
            else {
                this.displayed = true;
            }
        }
    };
    AlertComponent.prototype.isDisplayed = function () {
        return this.displayed || this.timerRunning;
    };
    return AlertComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], AlertComponent.prototype, "displayed", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlertComponent.prototype, "message", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AlertComponent.prototype, "severity", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], AlertComponent.prototype, "autoCloseDelay", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AlertComponent.prototype, "onAutoClose", void 0);
AlertComponent = __decorate([
    core_1.Component({
        selector: 'alert',
        templateUrl: 'alert.component.html',
        animations: [
            core_1.trigger('alertDisplayed', [
                core_1.state('true', core_1.style({ opacity: 1 })),
                core_1.state('false', core_1.style({ opacity: 0, margin: 0, padding: '0 15px' })),
                core_1.transition('1 => 0', core_1.animate('200ms')),
                core_1.transition('0 => 1', core_1.animate('200ms'))
            ])
        ]
    })
], AlertComponent);
exports.AlertComponent = AlertComponent;
//# sourceMappingURL=alert.component.js.map