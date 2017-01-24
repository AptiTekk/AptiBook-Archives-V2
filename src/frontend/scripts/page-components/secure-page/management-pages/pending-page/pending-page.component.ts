/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";
import {Reservation, ReservationWithDecisions} from "../../../../models/reservation.model";
import {UserGroupService} from "../../../../services/singleton/usergroup.service";
import {ReservationManagementService} from "../../../../services/singleton/reservation-management.service";
import moment = require("moment");

@Component({
    selector: 'pending-page',
    templateUrl: 'pending-page.component.html'
})
export class PendingPageComponent implements OnInit {

    /**
     * The currently signed in user.
     */
    user: User;

    /**
     * An array containing pending reservations.
     * @type {Array}
     */
    pendingReservations: ReservationWithDecisions[] = [];

    constructor(private reservationManagementService: ReservationManagementService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService
            .getUser()
            .subscribe(user => this.user = user);

        this.reservationManagementService
            .getPendingReservations()
            .subscribe(reservations => this.pendingReservations = reservations);
    }

    /*makeDecision(approved: boolean, reservation: Reservation) {
        this.reservationService.makeReservationDecision(approved, reservation).subscribe(response => {
            this.reservationService.getPendingReservations(this.user).subscribe(reservations => {
                this.pendingReservations = reservations;
            })
        });
    }*/
}

