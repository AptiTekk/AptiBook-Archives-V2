/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {Reservation} from "../../../../../models/reservation/reservation.model";
import {AuthService} from "../../../../../core/services/auth.service";
import {ReservationService} from "../../../../../core/services/reservation.service";

@Component({
    selector: 'at-upcoming-reservations',
    templateUrl: 'upcoming-reservations.component.html',
    styleUrls: ['upcoming-reservations.component.css']
})
export class UpcomingReservationsComponent {

    reservations: Reservation[];

    constructor(authService: AuthService, reservationService: ReservationService) {
        authService.getCurrentUser().subscribe(user => {
            if (user)
                reservationService.getUpcomingUserReservations(user)
                    .then(reservations => this.reservations = reservations);
        });
    }

    //noinspection JSMethodCanBeStatic
    getStatusLabelText(reservation: Reservation) {
        return reservation.approved ? "Approved" : reservation.pending ? "Pending" : "Unknown";
    }

    //noinspection JSMethodCanBeStatic
    getStatusLabelClassSuffix(reservation: Reservation) {
        return reservation.approved ? "success" : reservation.pending ? "default" : "warning";
    }

}