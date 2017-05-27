/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {Reservation} from "../../../models/reservation/reservation.model";
import {ReservationInfoModalComponent} from "../../../shared/reservation-info-modal/reservation-info-modal.component";
import {AuthService} from "../../../core/services/auth.service";
import {User} from "../../../models/user.model";
import {ResourceCategoryService} from "../../../core/services/resource-category.service";
import {ResourceCategory} from "../../../models/resource-category.model";
import {CalendarComponent} from "../../../shared/calendar/calendar.component";
import {AnalyticsService} from "../../../core/services/analytics.service";
import {NewReservationModalComponent} from "./new-reservation-modal/new-reservation-modal.component";

@Component({
    selector: 'at-dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    @ViewChild(ReservationInfoModalComponent) reservationInfoModal: ReservationInfoModalComponent;

    @ViewChild(NewReservationModalComponent) newReservationModal: NewReservationModalComponent;

    @ViewChild(CalendarComponent)
    calendar: CalendarComponent;

    currentUser: User;

    resourceCategories: ResourceCategory[];
    enabledResourceCategories: ResourceCategory[];

    filterOnlyUsersEvents: boolean = false;


    constructor(private authService: AuthService,
                private resourceCategoryService: ResourceCategoryService) {
    }

    ngOnInit(): void {
        // Get the currently signed in user.
        this.authService.getCurrentUser().subscribe(user => this.currentUser = user);

        // Get all the resource categories for the calendar filters.
        this.resourceCategoryService.getResourceCategories().take(1).subscribe(resourceCategories => {
            this.resourceCategories = resourceCategories.map(category => {
                category['enabled'] = true;
                return category;
            });
        });
    }

    /**
     * Called when an event on the calendar is clicked.
     * @param event The reservation that was clicked.
     */
    onCalendarEventClicked(event: Reservation): void {
        this.reservationInfoModal.display(event);
    }

    /**
     * Ensures that the resource categories are never undefined, only an empty array.
     */
    updateEnabledResourceCategories(): void {
        this.enabledResourceCategories = this.resourceCategories ? this.resourceCategories.filter(category => category['enabled']) : [];
    }

    onEventSelected(event): void {
        AnalyticsService.sendEvent({category: 'Dashboard', action: 'ClickEvent'});
        this.reservationInfoModal.display(event);
    }

    onDaySelected(day): void {
        AnalyticsService.sendEvent({category: 'Dashboard', action: 'ClickDay'});
        this.newReservationModal.display(day);
    }
}