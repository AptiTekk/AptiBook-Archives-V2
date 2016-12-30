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

@Component({
    selector: 'pending-page',
    templateUrl: 'pending-page.component.html'
})
export class PendingPageComponent {
    user: User;
    pendingReservations: ResourceCategory[]= [];
    reservationDetails: ReservationDetails[] = [];
    constructor(reservationService: ReservationService, authService: AuthService) {
        authService.getUser().subscribe(user => this.user = user);
        reservationService.getPendingReservationCategories(this.user).subscribe(resourceCategories => {
                this.pendingReservations = resourceCategories;
        });
        reservationService.getPendingReservationDetails(this.user).subscribe(details =>{
            this.reservationDetails = details;
        })
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