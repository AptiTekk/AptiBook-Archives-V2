/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {CurrentUserService} from "../../../../core/services/current-user.service";
import {Reservation} from "../../../../models/reservation/reservation.model";
import {ReservationService} from "../../../../core/services/reservation.service";
import * as moment from "moment";
import {ReservationInfoModalComponent} from "../../../../shared/reservation-info-modal/reservation-info-modal.component";
import Moment = moment.Moment;
import {AnalyticsService} from "../../../../core/services/analytics.service";

@Component({
    selector: 'at-dashboard-upcoming-reservations',
    templateUrl: 'dashboard-upcoming-reservations.component.html',
    styleUrls: ['dashboard-upcoming-reservations.component.css']
})
export class DashboardUpcomingReservationsComponent implements OnInit {

    @ViewChild(ReservationInfoModalComponent) reservationInfoModal: ReservationInfoModalComponent;

    /**
     * The current user's upcoming reservations.
     */
    reservations: Reservation[] = [];

    /**
     * The index of the reservation currently in view.
     */
    currentReservationIndex: number = 0;

    constructor(private currentUserService: CurrentUserService,
                private reservationService: ReservationService) {
    }

    ngOnInit() {
        this.currentUserService.getCurrentUser().take(1).subscribe(
            user => {
                this.reservationService.getUpcomingUserReservations(user).take(1).subscribe(
                    reservations => {
                        this.reservations = reservations;
                    }
                )
            }
        )
    }

    onClickUpArrow() {
        if (this.currentReservationIndex != 0) {
            AnalyticsService.sendEvent({
                category: 'Dashboard - Upcoming Reservations',
                action: 'ClickUpArrow'
            });
            this.currentReservationIndex--;
        }
    }

    onClickDownArrow() {
        if (this.currentReservationIndex < this.reservations.length - 1) {
            AnalyticsService.sendEvent({
                category: 'Dashboard - Upcoming Reservations',
                action: 'ClickDownArrow'
            });
            this.currentReservationIndex++;
        }
    }

    /**
     * Formats the string representation of a date into a relative time string.
     * @param dateString The date.
     * @returns The time string.
     */
    formatDate(dateString): string {
        let date: Moment = moment(dateString);
        return date.calendar();
    }

    /**
     * Called when the "More Information" button is clicked.
     */
    onClickMoreInformation() {
        AnalyticsService.sendEvent({
            category: 'Dashboard - Upcoming Reservations',
            action: 'ClickMoreInformation'
        });
        this.reservationInfoModal.display(this.reservations[this.currentReservationIndex]);
    }

}