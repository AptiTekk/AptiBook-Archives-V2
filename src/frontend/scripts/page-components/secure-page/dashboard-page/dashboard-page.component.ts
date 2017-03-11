/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, trigger, state, style, transition, animate, ViewChild, OnInit, AfterViewInit} from "@angular/core";
import {Reservation} from "../../../models/reservation/reservation.model";
import {APIService} from "../../../services/singleton/api.service";
import {ReservationInfoModalComponent} from "../../../components/reservation-info-modal/reservation-info-modal.component";
import {AuthService} from "../../../services/singleton/auth.service";
import {User} from "../../../models/user.model";
import {ResourceCategoryService} from "../../../services/singleton/resource-category.service";
import {ResourceCategory} from "../../../models/resource-category.model";
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {CalendarComponent} from "../../../components/calendar/calendar.component";

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {

    @ViewChild('reservationInfoModal')
    reservationInfoModal: ReservationInfoModalComponent;

    @ViewChild(CalendarComponent)
    calendar: CalendarComponent;

    currentUser: User;

    resourceCategories: ResourceCategory[];
    enabledResourceCategories: ResourceCategory[];

    filterOnlyUsersEvents: boolean = false;


    constructor(protected apiService: APIService,
                private authService: AuthService,
                private resourceCategoryService: ResourceCategoryService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        // Get the currently signed in user.
        this.authService.getUser().subscribe(user => this.currentUser = user);

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

}