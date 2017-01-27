/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";
import {
    ReservationWithUnorganizedDecisions, Reservation,
    ReservationWithOrganizedDecisions
} from "../../../../models/reservation.model";
import {ReservationManagementService} from "../../../../services/singleton/reservation-management.service";
import moment = require("moment");

@Component({
    selector: 'pending-page',
    templateUrl: 'pending-page.component.html',
    styleUrls: ['pending-page.component.css']
})
export class PendingPageComponent implements OnInit {

    /**
     * The currently signed in user.
     */
    user: User;

    /**
     * An array containing the pending reservations.
     */
    reservations: Reservation[] = [];

    reservationsAwaitingUser: Reservation[] = [];
    reservationsAwaitingOthers: Reservation[] = [];

    /**
     * The selected reservation.
     */
    protected selectedReservation: ReservationWithOrganizedDecisions;

    constructor(private reservationManagementService: ReservationManagementService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService
            .getUser()
            .subscribe(user => {
                this.user = user;

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
                    });
            });
    }

    /**
     * Fired when a reservation is clicked in the datatable.
     * @param reservation The clicked reservation.
     */
    onReservationSelected(reservation: Reservation) {
        // The reservation is considered unorganized if it does not have a hierarchy.
        if (!reservation['hierarchy']) {
            this.reservationManagementService.organizeReservation(reservation);
        }

        this.selectedReservation = reservation;
    }

    /**
     * Fired when the reservation that was selected in the datatable is deselected.
     */
    onReservationDeselected() {
        this.selectedReservation = null;
    }

    makeDecision(approved: boolean, reservation: Reservation) {
        this.reservationManagementService
            .makeDecision(approved, reservation)
            .subscribe(response => this.reservationManagementService.fetchReservations());
    }
}

