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
var auth_service_1 = require("../../../../services/singleton/auth.service");
var loader_service_1 = require("../../../../services/singleton/loader.service");
var reservation_management_service_1 = require("../../../../services/singleton/reservation-management.service");
var approval_modal_component_1 = require("../approval-modal/approval-modal.component");
var datatable_component_1 = require("../../../../components/datatable/datatable.component");
var ApprovedPageComponent = (function () {
    function ApprovedPageComponent(reservationManagementService, loaderService, authService) {
        this.reservationManagementService = reservationManagementService;
        this.loaderService = loaderService;
        this.authService = authService;
        /**
         * An array containing the approved reservations.
         */
        this.reservations = [];
    }
    ApprovedPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loaderService.startLoading();
        this.authService
            .getUser()
            .subscribe(function (user) {
            _this.user = user;
            if (user) {
                _this.reservationManagementService
                    .getApprovedReservations()
                    .subscribe(function (reservations) {
                    _this.reservations = reservations;
                    _this.loaderService.stopLoading();
                });
            }
        });
    };
    /**
     * Fired when a reservation is clicked in the datatable.
     * @param reservation The clicked reservation.
     */
    ApprovedPageComponent.prototype.onReservationSelected = function (reservation) {
        // The reservation is considered unorganized if it does not have a hierarchy.
        if (!reservation['hierarchy']) {
            this.reservationManagementService.organizeReservation(reservation);
        }
        this.selectedReservation = reservation;
        this.approvalModal.open(reservation);
    };
    /**
     * Fired when the reservation that was selected in the datatable is deselected.
     */
    ApprovedPageComponent.prototype.onReservationDeselected = function () {
        this.selectedReservation = null;
    };
    ApprovedPageComponent.prototype.deselectAll = function () {
        this.dataTable.deselectRows();
    };
    return ApprovedPageComponent;
}());
__decorate([
    core_1.ViewChild(approval_modal_component_1.ApprovalModalComponent),
    __metadata("design:type", approval_modal_component_1.ApprovalModalComponent)
], ApprovedPageComponent.prototype, "approvalModal", void 0);
__decorate([
    core_1.ViewChild(datatable_component_1.DataTableComponent),
    __metadata("design:type", datatable_component_1.DataTableComponent)
], ApprovedPageComponent.prototype, "dataTable", void 0);
ApprovedPageComponent = __decorate([
    core_1.Component({
        selector: 'approved-page',
        templateUrl: 'approved-page.component.html',
        styleUrls: ['approved-page.component.css']
    }),
    __metadata("design:paramtypes", [reservation_management_service_1.ReservationManagementService,
        loader_service_1.LoaderService,
        auth_service_1.AuthService])
], ApprovedPageComponent);
exports.ApprovedPageComponent = ApprovedPageComponent;
//# sourceMappingURL=approved-page.component.js.map