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
var reservation_management_service_1 = require("../../../services/singleton/reservation-management.service");
var ManagementContainerComponent = (function () {
    function ManagementContainerComponent(reservationManagementService) {
        this.reservationManagementService = reservationManagementService;
    }
    ManagementContainerComponent.prototype.ngOnInit = function () {
        this.reservationManagementService.fetchReservations();
    };
    return ManagementContainerComponent;
}());
ManagementContainerComponent = __decorate([
    core_1.Component({
        selector: 'management-container',
        templateUrl: 'management-container.component.html'
    }),
    __metadata("design:paramtypes", [reservation_management_service_1.ReservationManagementService])
], ManagementContainerComponent);
exports.ManagementContainerComponent = ManagementContainerComponent;
//# sourceMappingURL=management-container.component.js.map