/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {ModalComponent} from "../../../../components/modal/modal.component";
import {User} from "../../../../models/user.model";
import {ReservationWithOrganizedDecisions} from "../../../../models/reservation/reservation.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserGroup} from "../../../../models/user-group.model";
import {ReservationManagementService} from "../../../../services/singleton/reservation-management.service";
import {AlertComponent} from "../../../../components/alert/alert.component";
import {ConfirmationModalComponent} from "../../../../components/index";
import moment = require("moment");

@Component({
    selector: 'approval-modal',
    templateUrl: 'approval-modal.component.html'
})
export class ApprovalModalComponent implements OnInit {

    /**
     * The modal contained within this component.
     */
    @ViewChild(ModalComponent) modal: ModalComponent;

    @ViewChild('dangerAlert') dangerAlert: AlertComponent;

    /**
     * The modal to display when the user is overriding a decision.
     */
    @ViewChild('overrideConfirmationModal') overrideConfirmationModal: ConfirmationModalComponent;

    /**
     * The modal to display when the user is changing their decision.
     */
    @ViewChild('changeConfirmationModal') changeConfirmationModal: ConfirmationModalComponent;

    /**
     * Fired when the user approves the reservation.
     */
    @Output() approved = new EventEmitter<void>();

    /**
     * Fired when the user rejects the reservation.
     */
    @Output() rejected = new EventEmitter<void>();

    /**
     * Fired when the user closes the modal (via the close button or one of the decisions).
     */
    @Output() closed = new EventEmitter<void>();

    /**
     * The currently signed in user.
     */
    protected user: User;

    /**
     * The user group that the user is deciding on behalf of.
     */
    protected behalfOfGroup: UserGroup;

    /**
     * The reservation which is being approved or rejected.
     */
    protected reservation: ReservationWithOrganizedDecisions;

    /**
     * Contains read-only fields for the reservation being approved or rejected.
     */
    protected formGroup: FormGroup;

    constructor(private authService: AuthService,
                private managementService: ReservationManagementService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.authService
            .getUser()
            .subscribe(user => this.user = user);

        this.formGroup = this.formBuilder.group({
            title: [null],
            requestedBy: [null],
            requestedOn: [null],
            startTime: [null],
            endTime: [null]
        });
    }

    /**
     * Opens the modal and displays data for the provided reservation.
     * @param reservation The reservation to display.
     */
    public open(reservation: ReservationWithOrganizedDecisions): void {
        this.reservation = reservation;

        this.formGroup = this.formBuilder.group({
            title: [reservation.title],
            requestedBy: [reservation.user.fullName],
            requestedOn: [moment(reservation.dateCreated).format('dddd, MMM D, YYYY, h:mm A')],
            startTime: [moment(reservation.start).format('dddd, MMM D, YYYY, h:mm A')],
            endTime: [moment(reservation.end).format('dddd, MMM D, YYYY, h:mm A')]
        });

        this.modal.openModal();
    }

    /**
     * Closes the modal without firing any events.
     */
    public close(): void {
        this.modal.closeModal();
        this.behalfOfGroup = null;
        this.closed.emit();
    }

    /**
     * Called when the user clicks "Approve" on the modal.
     * Fires the approved emitter.
     *
     * @param skipExistingDecisionCheck Whether or not to skip the check for existing decisions (which may display a modal).
     * @param skipOverridingDecisionCheck Whether or not to skip the check for overriding decisions (which may display a modal).
     */
    private onApprove(skipExistingDecisionCheck: boolean = false, skipOverridingDecisionCheck: boolean = false): void {

        // Check if we are changing the decision.
        if (!skipExistingDecisionCheck && this.reservation.decidingFor.decision) {
            this.changeConfirmationModal.open();

            this.changeConfirmationModal
                .decision
                .take(1)
                .subscribe(decision => {
                    if (decision)
                        this.onApprove(true);
                });

            return;
        }

        // Check if we are overriding another decision
        else if (!skipOverridingDecisionCheck) {
            let willOverride: boolean = false;

            // Search for the group we are deciding for in the hierarchy,
            // then check if any group below will be overridden.

            // If a group below ours is already overridden,
            // then we don't need to warn about any groups below them.
            let foundDecidingForGroup: boolean = false;
            for (let relation of this.reservation.decisionHierarchy) {
                if (foundDecidingForGroup) {
                    if (relation.overriddenBy)
                        break;
                    if (relation.decision == null || relation.decision.rejected)
                        willOverride = true;
                } else if (relation === this.reservation.decidingFor) {
                    foundDecidingForGroup = true;
                }
            }

            if (willOverride) {
                this.overrideConfirmationModal.open();

                this.overrideConfirmationModal
                    .decision
                    .take(1)
                    .subscribe(decision => {
                        if (decision)
                            this.onApprove(true, true);
                    });

                return;
            }
        }

        this.managementService
            .makeDecision(true, this.reservation)
            .subscribe(
                decision => {
                    this.close();
                    this.approved.emit();
                },
                err => {
                    this.dangerAlert.display(err);
                }
            );
    }

    /**
     * Called when the user clicks "Reject" on the modal.
     * Fires the rejected emitter.
     *
     * @param skipExistingDecisionCheck Whether or not to skip the check for existing decisions (which may display a modal).
     * @param skipOverridingDecisionCheck Whether or not to skip the check for overriding decisions (which may display a modal).
     */
    private onReject(skipExistingDecisionCheck: boolean = false, skipOverridingDecisionCheck: boolean = false): void {

        // Check if we are changing the decision.
        if (!skipExistingDecisionCheck && this.reservation.decidingFor.decision) {
            this.changeConfirmationModal.open();

            this.changeConfirmationModal
                .decision
                .take(1)
                .subscribe(decision => {
                    if (decision)
                        this.onReject(true);
                });

            return;
        }

        // Check if we are overriding another decision
        else if (!skipOverridingDecisionCheck) {
            let willOverride: boolean = false;

            // Search for the group we are deciding for in the hierarchy,
            // then check if any group below will be overridden.

            // If a group below ours is already overridden,
            // then we don't need to warn about any groups below them.
            let foundDecidingForGroup: boolean = false;
            for (let relation of this.reservation.decisionHierarchy) {
                if (foundDecidingForGroup) {
                    if (relation.overriddenBy)
                        break;
                    if (relation.decision == null || relation.decision.approved)
                        willOverride = true;
                } else if (relation === this.reservation.decidingFor) {
                    foundDecidingForGroup = true;
                }
            }

            if (willOverride) {
                this.overrideConfirmationModal.open();

                this.overrideConfirmationModal
                    .decision
                    .take(1)
                    .subscribe(decision => {
                        if (decision)
                            this.onReject(true, true);
                    });

                return;
            }
        }

        this.managementService
            .makeDecision(false, this.reservation)
            .subscribe(
                decision => {
                    this.close();
                    this.rejected.emit();
                },
                err => {
                    this.dangerAlert.display(err);
                }
            );
    }

    /**
     * Called when the user clicks "Close" on the modal.
     */
    private onClose(): void {
        this.close();
    }

}