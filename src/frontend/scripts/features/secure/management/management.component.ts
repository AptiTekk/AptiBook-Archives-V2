/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {HeaderComponent} from "../../../app/header/header.component";
import {ReservationManagementService} from "../../../core/services/reservation-management.service";

@Component({
    selector: 'at-management',
    templateUrl: 'management.component.html'
})
export class ManagementComponent implements OnInit {

    constructor(private reservationManagementService: ReservationManagementService) {}

    ngOnInit(): void {
        this.reservationManagementService.fetchReservations();
    }

}