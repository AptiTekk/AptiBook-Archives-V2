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
import {Moment} from "moment";

@Component({
    selector: 'at-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    @ViewChild(ReservationInfoModalComponent) reservationInfoModal: ReservationInfoModalComponent;

    @ViewChild(NewReservationModalComponent) newReservationModal: NewReservationModalComponent;

    @ViewChild(CalendarComponent) calendar: CalendarComponent;

    /**
     * The calendar's current view (only applicable to lg and xl screens)
     */
    currentView: string = "month";

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
        this.resourceCategoryService.getResourceCategories()
            .take(1).subscribe(resourceCategories => {
            this.resourceCategories = resourceCategories.map(category => {
                category['enabled'] = true;
                return category;
            })
        })
    }

    /**
     * Sets the current view of the calendar to the provided value.
     * @param viewName The name of the calendar view.
     */
    setCurrentView(viewName: string) {
        AnalyticsService.sendEvent({category: 'Dashboard', action: 'ChangeView', label: viewName});
        this.currentView = viewName;
    }

    /**
     * Ensures that the resource categories are never undefined, only an empty array.
     */
    updateEnabledResourceCategories(): void {
        this.enabledResourceCategories = this.resourceCategories ? this.resourceCategories.filter(category => category['enabled']) : [];
    }

    /**
     * Called when an event on the calendar is clicked on.
     * @param event The event clicked on.
     */
    onEventSelected(event: Reservation): void {
        AnalyticsService.sendEvent({category: 'Dashboard', action: 'ClickEvent'});
        this.reservationInfoModal.display(event);
    }

    /**
     * Called when a day on the calendar is clicked on.
     * @param day The date of the day clicked.
     */
    onDaySelected(day: Moment): void {
        AnalyticsService.sendEvent({category: 'Dashboard', action: 'ClickDay'});
        this.newReservationModal.display(day);
    }
}