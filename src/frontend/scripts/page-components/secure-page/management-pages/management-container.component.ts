/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {HeaderComponent} from "../../../components/header/header.component";
import {ReservationManagementService} from "../../../services/singleton/reservation-management.service";

@Component({
    selector: 'management-container',
    templateUrl: 'management-container.component.html'
})
export class ManagementContainerComponent implements OnInit {

    constructor(private reservationManagementService: ReservationManagementService) {}

    ngOnInit(): void {
        this.reservationManagementService.fetchPendingReservations();
        this.reservationManagementService.fetchApprovedReservations();
        this.reservationManagementService.fetchRejectedReservations();
    }

//noinspection JSMethodCanBeStatic
    get managementLinks() {
        return HeaderComponent.RESERVATION_MANAGEMENT_LINKS;
    }

}