/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from '@angular/core';
import {Reservation, ReservationWithOrganizedDecisions} from "../../../../models/reservation.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {LoaderService} from "../../../../services/singleton/loader.service";
import {ReservationManagementService} from "../../../../services/singleton/reservation-management.service";
import {User} from "../../../../models/user.model";
@Component({
    selector: 'rejected-page',
    templateUrl: 'rejected-page.component.html',
    styleUrls: ['rejected-page.component.css']
})
export class RejectedPageComponent{
    /**
     * The currently signed in user.
     */
    user: User;

    /**
     * An array containing the approved reservations.
     */
    reservations: Reservation[] = [];

    /**
     * The selected reservation.
     */
    protected selectedReservation: ReservationWithOrganizedDecisions;

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
                        .getRejectedReservations()
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
}