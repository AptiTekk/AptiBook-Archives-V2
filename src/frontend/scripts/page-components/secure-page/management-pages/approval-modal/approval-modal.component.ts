/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../../../../components/modal/modal.component";
import {User} from "../../../../models/user.model";
import {Reservation, ReservationWithOrganizedDecisions} from "../../../../models/reservation.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";
import moment = require("moment");
import {UserGroup} from "../../../../models/user-group.model";
import {ReservationManagementService} from "../../../../services/singleton/reservation-management.service";
import {AlertComponent} from "../../../../components/alert/alert.component";

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
     * Fired when the user approves the reservation.
     */
    @Output() approved = new EventEmitter<void>();

    /**
     * Fired when the user rejects the reservation.
     */
    @Output() rejected = new EventEmitter<void>();

    /**
     * Fired when the user cancels all operations and closes the modal.
     */
    @Output() cancelled = new EventEmitter<void>();

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
    }

    /**
     * Called when the user clicks "Approve" on the modal.
     * Fires the approved emitter.
     */
    private onApprove(): void {
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
     */
    private onReject(): void {
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
     * Called when the user clicks "Cancel" on the modal.
     * Fires the cancelled emitter.
     */
    private onCancel(): void {
        this.close();
        this.cancelled.emit();
    }

}