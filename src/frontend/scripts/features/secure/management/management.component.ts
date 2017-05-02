/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit} from "@angular/core";
import {ReservationManagementService} from "../../../core/services/reservation-management.service";
import {NavigationLink} from "../../../shared/navigation/navigation-link.model";

@Component({
    selector: 'at-management',
    templateUrl: 'management.component.html'
})
export class ManagementComponent implements OnInit {

    navigationLinks: NavigationLink[] =
        [
            {
                path: ['', 'secure', 'management', 'queue'],
                label: "Approval Queue",
                icon: "hourglass-half"
            },
            {
                path: ['', 'secure', 'management', 'approved'],
                label: "Approved Reservations",
                icon: "calendar-check-o"
            },
            {
                path: ['', 'secure', 'management', 'rejected'],
                label: "Rejected Reservations",
                icon: "calendar-times-o"
            },
            {
                path: ['', 'secure', 'management', 'calendar'],
                label: "Management Calendar",
                icon: "calendar"
            }
        ];

    constructor(private reservationManagementService: ReservationManagementService) {
    }

    ngOnInit(): void {
        this.reservationManagementService.fetchReservations();
    }

}