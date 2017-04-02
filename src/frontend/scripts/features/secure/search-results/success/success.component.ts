/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {ReservationService} from "../../../../core/services/reservation.service";
import {Reservation} from "../../../../models/reservation/reservation.model";
import {APIService} from "../../../../core/services/api.service";

@Component({
    selector: 'at-search-success',
    templateUrl: 'success.component.html'
})
export class SuccessComponent {

    reservation: Reservation;

    constructor(protected apiService: APIService, reservationService: ReservationService) {
        reservationService.getLastReservationMade().subscribe(reservation => this.reservation = reservation);
    }
}