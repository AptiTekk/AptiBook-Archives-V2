/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../../../../core/services/auth.service";
import {User} from "../../../../models/user.model";
import {Reservation, ReservationWithOrganizedDecisions} from "../../../../models/reservation/reservation.model";
import {ReservationManagementService} from "../../../../core/services/reservation-management.service";
import {LoaderService} from "../../../../core/services/loader.service";
import {ApprovalModalComponent} from "../approval-modal/approval-modal.component";
import {DataTableComponent} from "../../../../shared/datatable/datatable.component";
import {AnalyticsService} from "../../../../core/services/analytics.service";

@Component({
    selector: 'at-management-approval-queue',
    templateUrl: 'approval-queue.component.html',
    styleUrls: ['approval-queue.component.css']
})
export class ApprovalQueueComponent implements OnInit {

    /**
     * The currently signed in user.
     */
    user: User;

    /**
     * An array containing the pending reservations.
     */
    reservations: Reservation[] = [];

    @ViewChild('awaitingUserTable') awaitingUserTable: DataTableComponent;
    reservationsAwaitingUser: Reservation[] = [];

    @ViewChild('awaitingOthersTable') awaitingOthersTable: DataTableComponent;
    reservationsAwaitingOthers: Reservation[] = [];

    @ViewChild(ApprovalModalComponent) approvalModal: ApprovalModalComponent;

    /**
     * The selected reservation.
     */
    selectedReservation: ReservationWithOrganizedDecisions;

    constructor(private reservationManagementService: ReservationManagementService,
                private loaderService: LoaderService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.loaderService.startLoading();

        this.authService
            .getCurrentUser()
            .subscribe(user => {
                this.user = user;

                if (user) {
                    this.reservationManagementService
                        .getPendingReservations()
                        .subscribe(reservations => {
                            this.reservations = reservations;
                            this.reservationsAwaitingUser = [];
                            this.reservationsAwaitingOthers = [];

                            reservations.forEach(reservation => {
                                let awaitingUsersDecision = true;

                                for (let decision of reservation.decisions) {
                                    for (let group of user.userGroups) {
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
                                    this.reservationsAwaitingUser.push(reservation);
                                else
                                    this.reservationsAwaitingOthers.push(reservation);
                            });

                            this.loaderService.stopLoading();
                        });
                }
            });
    }

    /**
     * Fired when a reservation is clicked in the datatable.
     * @param reservation The clicked reservation.
     */
    onReservationSelected(reservation: Reservation) {
        AnalyticsService.sendEvent({
            category: 'Management - Approval Queue',
            action: 'ClickReservation'
        });

        // The reservation is considered unorganized if it does not have a hierarchy.
        if (!reservation['hierarchy']) {
            this.reservationManagementService.organizeReservation(reservation);
        }

        this.selectedReservation = reservation;

        this.approvalModal.open(this.selectedReservation);
    }

    /**
     * Fired when the reservation that was selected in the datatable is deselected.
     */
    onReservationDeselected() {
        this.selectedReservation = null;
    }

    deselectAll() {
        this.awaitingUserTable.deselectRows();
        this.awaitingOthersTable.deselectRows();
    }

    decisionMade() {
        this.reservationManagementService.fetchReservations();
    }
}

