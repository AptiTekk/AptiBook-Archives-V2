/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from '@angular/core';
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";
import {ReservationDetails} from "../../../../models/reservation-details.model";
import {ResourceCategory} from "../../../../models/resource-category.model";
import moment = require("moment");
import {Reservation} from "../../../../models/reservation.model";
import {ReservationDecision} from "../../../../models/reservation-decision.model";

@Component({
    selector: 'pending-page',
    templateUrl: 'pending-page.component.html'
})
export class PendingPageComponent {
    user: User;
    pendingReservations: Reservation[]= [];
    reservationDecisions: ReservationDecision[] = [];
    constructor(private reservationService: ReservationService, authService: AuthService) {
        authService.getUser().subscribe(user => this.user = user);
        reservationService.getPendingReservations(this.user).subscribe(reservations => {
                this.pendingReservations = reservations;
        });

    }


    formatFriendly(date: string){
        return moment(date);
    }

    getReservationDecisions(reservation: Reservation){
        if(reservation == undefined){
            console.log("passed if");
            this.reservationService.getReservationDecisions(reservation).subscribe(decisions =>
                this.reservationDecisions = decisions
            );
        }
    }



}


/*
 TODO:
 * Get pending reservation resource categories, implement backend and front end services
 * Get reservation details for resource categories, implement backend and front end services
 * Get map from backend via Angular service
 * subscribe to service in component
 * Make Panels for reservations
 * Add backend methods for approve/rejection of reservations and implement into frontend
 * */