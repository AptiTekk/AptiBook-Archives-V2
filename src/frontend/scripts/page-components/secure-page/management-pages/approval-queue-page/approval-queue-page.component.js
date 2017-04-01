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
var auth_service_1 = require("../../../../services/singleton/auth.service");
var reservation_management_service_1 = require("../../../../services/singleton/reservation-management.service");
var loader_service_1 = require("../../../../services/singleton/loader.service");
var approval_modal_component_1 = require("../approval-modal/approval-modal.component");
var datatable_component_1 = require("../../../../components/datatable/datatable.component");
var ApprovalQueuePageComponent = (function () {
    function ApprovalQueuePageComponent(reservationManagementService, loaderService, authService) {
        this.reservationManagementService = reservationManagementService;
        this.loaderService = loaderService;
        this.authService = authService;
        /**
         * An array containing the pending reservations.
         */
        this.reservations = [];
        this.reservationsAwaitingUser = [];
        this.reservationsAwaitingOthers = [];
    }
    ApprovalQueuePageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loaderService.startLoading();
        this.authService
            .getUser()
            .subscribe(function (user) {
            _this.user = user;
            if (user) {
                _this.reservationManagementService
                    .getPendingReservations()
                    .subscribe(function (reservations) {
                    _this.reservations = reservations;
                    _this.reservationsAwaitingUser = [];
                    _this.reservationsAwaitingOthers = [];
                    reservations.forEach(function (reservation) {
                        var awaitingUsersDecision = true;
                        for (var _i = 0, _a = reservation.decisions; _i < _a.length; _i++) {
                            var decision = _a[_i];
                            for (var _b = 0, _c = user.userGroups; _b < _c.length; _b++) {
                                var group = _c[_b];
                                if (decision.userGroup.id === group.id) {
                                    awaitingUsersDecision = false;
                                    reservation['usersDecision'] = decision;
                                    break;
                                }
                            }
                            if (!awaitingUsersDecision)
                                break;
                        }
                        if (awaitingUsersDecision)
                            _this.reservationsAwaitingUser.push(reservation);
                        else
                            _this.reservationsAwaitingOthers.push(reservation);
                    });
                    _this.loaderService.stopLoading();
                });
            }
        });
    };
    /**
     * Fired when a reservation is clicked in the datatable.
     * @param reservation The clicked reservation.
     */
    ApprovalQueuePageComponent.prototype.onReservationSelected = function (reservation) {
        // The reservation is considered unorganized if it does not have a hierarchy.
        if (!reservation['hierarchy']) {
            this.reservationManagementService.organizeReservation(reservation);
        }
        this.selectedReservation = reservation;
        this.approvalModal.open(this.selectedReservation);
    };
    /**
     * Fired when the reservation that was selected in the datatable is deselected.
     */
    ApprovalQueuePageComponent.prototype.onReservationDeselected = function () {
        this.selectedReservation = null;
    };
    ApprovalQueuePageComponent.prototype.deselectAll = function () {
        this.awaitingUserTable.deselectRows();
        this.awaitingOthersTable.deselectRows();
    };
    ApprovalQueuePageComponent.prototype.decisionMade = function () {
        this.reservationManagementService.fetchReservations();
    };
    return ApprovalQueuePageComponent;
}());
__decorate([
    core_1.ViewChild('awaitingUserTable'),
    __metadata("design:type", datatable_component_1.DataTableComponent)
], ApprovalQueuePageComponent.prototype, "awaitingUserTable", void 0);
__decorate([
    core_1.ViewChild('awaitingOthersTable'),
    __metadata("design:type", datatable_component_1.DataTableComponent)
], ApprovalQueuePageComponent.prototype, "awaitingOthersTable", void 0);
__decorate([
    core_1.ViewChild(approval_modal_component_1.ApprovalModalComponent),
    __metadata("design:type", approval_modal_component_1.ApprovalModalComponent)
], ApprovalQueuePageComponent.prototype, "approvalModal", void 0);
ApprovalQueuePageComponent = __decorate([
    core_1.Component({
        selector: 'approval-queue-page',
        templateUrl: 'approval-queue-page.component.html',
        styleUrls: ['approval-queue-page.component.css']
    }),
    __metadata("design:paramtypes", [reservation_management_service_1.ReservationManagementService,
        loader_service_1.LoaderService,
        auth_service_1.AuthService])
], ApprovalQueuePageComponent);
exports.ApprovalQueuePageComponent = ApprovalQueuePageComponent;
//# sourceMappingURL=approval-queue-page.component.js.map