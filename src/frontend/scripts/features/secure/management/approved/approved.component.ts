/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ViewChild} from '@angular/core';
import {User} from "../../../../models/user.model";
import {Reservation, ReservationWithOrganizedDecisions} from "../../../../models/reservation/reservation.model";
import {AuthService} from "../../../../core/services/auth.service";
import {LoaderService} from "../../../../core/services/loader.service";
import {ReservationManagementService} from "../../../../core/services/reservation-management.service";
import {ApprovalModalComponent} from "../approval-modal/approval-modal.component";
import {DataTableComponent} from "../../../../shared/datatable/datatable.component";

@Component({
    selector: 'at-management-approved',
    templateUrl: 'approved.component.html',
    styleUrls: ['approved.component.css']
})
export class ApprovedComponent {
    /**
     * The currently signed in user.
     */
    protected user: User;

    /**
     * An array containing the approved reservations.
     */
    protected reservations: Reservation[] = [];

    /**
     * The selected reservation.
     */
    protected selectedReservation: ReservationWithOrganizedDecisions;

    /**
     * The modal for viewing reservation details
     */
    @ViewChild(ApprovalModalComponent) protected approvalModal: ApprovalModalComponent;

    /**
     * The datatable containing the information about the reservations.
     */
    @ViewChild(DataTableComponent) protected dataTable: DataTableComponent;

    constructor(private reservationManagementService: ReservationManagementService,
                private loaderService: LoaderService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.loaderService.startLoading();
        this.authService
            .getUser()
            .subscribe(user => {
                this.user = user;
                if (user) {
                    this.reservationManagementService
                        .getApprovedReservations()
                        .subscribe(reservations => {
                            this.reservations = reservations;
                            this.loaderService.stopLoading();
                        });
                }
            });
    }

    /**
     * Fired when a reservation is clicked in the datatable.
     * @param reservation The clicked reservation.
     */
    protected onReservationSelected(reservation: Reservation) {
        // The reservation is considered unorganized if it does not have a hierarchy.
        if (!reservation['hierarchy']) {
            this.reservationManagementService.organizeReservation(reservation);
        }
        this.selectedReservation = reservation;

        this.approvalModal.open(reservation);
    }

    /**
     * Fired when the reservation that was selected in the datatable is deselected.
     */
    protected onReservationDeselected() {
        this.selectedReservation = null;
    }

    protected deselectAll(): void {
        this.dataTable.deselectRows();
    }
}