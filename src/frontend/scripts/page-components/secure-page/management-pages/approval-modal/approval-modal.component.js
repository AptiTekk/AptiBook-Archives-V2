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
var modal_component_1 = require("../../../../components/modal/modal.component");
var auth_service_1 = require("../../../../services/singleton/auth.service");
var forms_1 = require("@angular/forms");
var reservation_management_service_1 = require("../../../../services/singleton/reservation-management.service");
var alert_component_1 = require("../../../../components/alert/alert.component");
var index_1 = require("../../../../components/index");
var moment = require("moment");
var ApprovalModalComponent = (function () {
    function ApprovalModalComponent(authService, managementService, formBuilder) {
        this.authService = authService;
        this.managementService = managementService;
        this.formBuilder = formBuilder;
        /**
         * Fired when the user approves the reservation.
         */
        this.approved = new core_1.EventEmitter();
        /**
         * Fired when the user rejects the reservation.
         */
        this.rejected = new core_1.EventEmitter();
        /**
         * Fired when the user closes the modal (via the close button or one of the decisions).
         */
        this.closed = new core_1.EventEmitter();
    }
    ApprovalModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService
            .getUser()
            .subscribe(function (user) { return _this.user = user; });
        this.formGroup = this.formBuilder.group({
            title: [null],
            requestedBy: [null],
            requestedOn: [null],
            startTime: [null],
            endTime: [null]
        });
    };
    /**
     * Opens the modal and displays data for the provided reservation.
     * @param reservation The reservation to display.
     */
    ApprovalModalComponent.prototype.open = function (reservation) {
        this.reservation = reservation;
        this.formGroup = this.formBuilder.group({
            title: [reservation.title],
            requestedBy: [reservation.user.fullName],
            requestedOn: [moment(reservation.dateCreated).format('dddd, MMM D, YYYY, h:mm A')],
            startTime: [moment(reservation.start).format('dddd, MMM D, YYYY, h:mm A')],
            endTime: [moment(reservation.end).format('dddd, MMM D, YYYY, h:mm A')]
        });
        this.modal.openModal();
    };
    /**
     * Closes the modal without firing any events.
     */
    ApprovalModalComponent.prototype.close = function () {
        this.modal.closeModal();
        this.behalfOfGroup = null;
        this.closed.emit();
    };
    /**
     * Called when the user clicks "Approve" on the modal.
     * Fires the approved emitter.
     *
     * @param skipExistingDecisionCheck Whether or not to skip the check for existing decisions (which may display a modal).
     * @param skipOverridingDecisionCheck Whether or not to skip the check for overriding decisions (which may display a modal).
     */
    ApprovalModalComponent.prototype.onApprove = function (skipExistingDecisionCheck, skipOverridingDecisionCheck) {
        var _this = this;
        if (skipExistingDecisionCheck === void 0) { skipExistingDecisionCheck = false; }
        if (skipOverridingDecisionCheck === void 0) { skipOverridingDecisionCheck = false; }
        // Check if we are changing the decision.
        if (!skipExistingDecisionCheck && this.reservation.decidingFor.decision) {
            this.changeConfirmationModal.open();
            this.changeConfirmationModal
                .decision
                .take(1)
                .subscribe(function (decision) {
                if (decision)
                    _this.onApprove(true);
            });
            return;
        }
        else if (!skipOverridingDecisionCheck) {
            var willOverride = false;
            // Search for the group we are deciding for in the hierarchy,
            // then check if any group below will be overridden.
            // If a group below ours is already overridden,
            // then we don't need to warn about any groups below them.
            var foundDecidingForGroup = false;
            for (var _i = 0, _a = this.reservation.decisionHierarchy; _i < _a.length; _i++) {
                var relation = _a[_i];
                if (foundDecidingForGroup) {
                    if (relation.overriddenBy)
                        break;
                    if (relation.decision == null || relation.decision.rejected)
                        willOverride = true;
                }
                else if (relation === this.reservation.decidingFor) {
                    foundDecidingForGroup = true;
                }
            }
            if (willOverride) {
                this.overrideConfirmationModal.open();
                this.overrideConfirmationModal
                    .decision
                    .take(1)
                    .subscribe(function (decision) {
                    if (decision)
                        _this.onApprove(true, true);
                });
                return;
            }
        }
        this.managementService
            .makeDecision(true, this.reservation)
            .subscribe(function (decision) {
            _this.close();
            _this.approved.emit();
        }, function (err) {
            _this.dangerAlert.display(err);
        });
    };
    /**
     * Called when the user clicks "Reject" on the modal.
     * Fires the rejected emitter.
     *
     * @param skipExistingDecisionCheck Whether or not to skip the check for existing decisions (which may display a modal).
     * @param skipOverridingDecisionCheck Whether or not to skip the check for overriding decisions (which may display a modal).
     */
    ApprovalModalComponent.prototype.onReject = function (skipExistingDecisionCheck, skipOverridingDecisionCheck) {
        var _this = this;
        if (skipExistingDecisionCheck === void 0) { skipExistingDecisionCheck = false; }
        if (skipOverridingDecisionCheck === void 0) { skipOverridingDecisionCheck = false; }
        // Check if we are changing the decision.
        if (!skipExistingDecisionCheck && this.reservation.decidingFor.decision) {
            this.changeConfirmationModal.open();
            this.changeConfirmationModal
                .decision
                .take(1)
                .subscribe(function (decision) {
                if (decision)
                    _this.onReject(true);
            });
            return;
        }
        else if (!skipOverridingDecisionCheck) {
            var willOverride = false;
            // Search for the group we are deciding for in the hierarchy,
            // then check if any group below will be overridden.
            // If a group below ours is already overridden,
            // then we don't need to warn about any groups below them.
            var foundDecidingForGroup = false;
            for (var _i = 0, _a = this.reservation.decisionHierarchy; _i < _a.length; _i++) {
                var relation = _a[_i];
                if (foundDecidingForGroup) {
                    if (relation.overriddenBy)
                        break;
                    if (relation.decision == null || relation.decision.approved)
                        willOverride = true;
                }
                else if (relation === this.reservation.decidingFor) {
                    foundDecidingForGroup = true;
                }
            }
            if (willOverride) {
                this.overrideConfirmationModal.open();
                this.overrideConfirmationModal
                    .decision
                    .take(1)
                    .subscribe(function (decision) {
                    if (decision)
                        _this.onReject(true, true);
                });
                return;
            }
        }
        this.managementService
            .makeDecision(false, this.reservation)
            .subscribe(function (decision) {
            _this.close();
            _this.rejected.emit();
        }, function (err) {
            _this.dangerAlert.display(err);
        });
    };
    /**
     * Called when the user clicks "Close" on the modal.
     */
    ApprovalModalComponent.prototype.onClose = function () {
        this.close();
    };
    return ApprovalModalComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], ApprovalModalComponent.prototype, "modal", void 0);
__decorate([
    core_1.ViewChild('dangerAlert'),
    __metadata("design:type", alert_component_1.AlertComponent)
], ApprovalModalComponent.prototype, "dangerAlert", void 0);
__decorate([
    core_1.ViewChild('overrideConfirmationModal'),
    __metadata("design:type", typeof (_a = typeof index_1.ConfirmationModalComponent !== "undefined" && index_1.ConfirmationModalComponent) === "function" && _a || Object)
], ApprovalModalComponent.prototype, "overrideConfirmationModal", void 0);
__decorate([
    core_1.ViewChild('changeConfirmationModal'),
    __metadata("design:type", typeof (_b = typeof index_1.ConfirmationModalComponent !== "undefined" && index_1.ConfirmationModalComponent) === "function" && _b || Object)
], ApprovalModalComponent.prototype, "changeConfirmationModal", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ApprovalModalComponent.prototype, "approved", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ApprovalModalComponent.prototype, "rejected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ApprovalModalComponent.prototype, "closed", void 0);
ApprovalModalComponent = __decorate([
    core_1.Component({
        selector: 'approval-modal',
        templateUrl: 'approval-modal.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        reservation_management_service_1.ReservationManagementService,
        forms_1.FormBuilder])
], ApprovalModalComponent);
exports.ApprovalModalComponent = ApprovalModalComponent;
var _a, _b;
//# sourceMappingURL=approval-modal.component.js.map