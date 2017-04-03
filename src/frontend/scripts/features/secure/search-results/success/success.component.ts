/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {ReservationService} from "../../../../core/services/reservation.service";
import {Reservation} from "../../../../models/reservation/reservation.model";

@Component({
    selector: 'at-search-success',
    templateUrl: 'success.component.html'
})
export class SuccessComponent implements OnInit {

    reservation: Reservation;

    constructor(private reservationService: ReservationService) {
    }

    ngOnInit(): void {
        this.reservationService.getLastReservationMade().subscribe(reservation => this.reservation = reservation);
    }
}