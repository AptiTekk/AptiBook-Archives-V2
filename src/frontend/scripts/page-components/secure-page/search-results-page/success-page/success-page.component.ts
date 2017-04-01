/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {Reservation} from "../../../../models/reservation/reservation.model";
import {APIService} from "../../../../services/singleton/api.service";

@Component({
    selector: 'success-page',
    templateUrl: 'success-page.component.html'
})
export class SuccessPageComponent {

    reservation: Reservation;

    constructor(protected apiService: APIService, reservationService: ReservationService) {
        reservationService.getLastReservationMade().subscribe(reservation => this.reservation = reservation);
    }
}