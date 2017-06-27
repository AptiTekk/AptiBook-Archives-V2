/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {UserGroupService} from "../../../../core/services/usergroup.service";
import {UserGroup} from "../../../../models/user-group.model";
import {ResourceCategoryService} from "../../../../core/services/resource-category.service";
import {ReservationInfoModalComponent} from "../../../../shared/reservation-info-modal/reservation-info-modal.component";
import {User} from "../../../../models/user.model";
import {ResourceCategory} from "../../../../models/resource-category.model";
import {Reservation} from "../../../../models/reservation/reservation.model";
import {AuthService} from "../../../../core/services/auth.service";
import {AnalyticsService} from "../../../../core/services/analytics.service";

@Component({
    selector: 'at-management-calendar',
    templateUrl: 'calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    @ViewChild('reservationInfoModal')
    reservationInfoModal: ReservationInfoModalComponent;

    userGroupOwnerFilter: UserGroup[];
    currentUser: User;

    /**
     * The calendar's current view (only applicable to lg and xl screens)
     */
    currentView: string = 'month';

    resourceCategories: ResourceCategory[];
    enabledResourceCategories: ResourceCategory[];

    constructor(private userGroupService: UserGroupService,
                private resourceCategoryService: ResourceCategoryService,
                private authService: AuthService) {
    }

    ngOnInit(): void {

        // Get user and hierarchy down
        this.authService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
            this.userGroupOwnerFilter = [];

            if (user)
                user.userGroups.forEach(userGroup => {
                    this.userGroupService.getUserGroupHierarchyDown(userGroup)
                        .then(hierarchyGroups => this.userGroupOwnerFilter.push(...hierarchyGroups))
                })
        })

        // Get Resource Categories
        this.resourceCategoryService.getResourceCategories()
            .take(1)
            .subscribe(resourceCategories => {
                this.resourceCategories = resourceCategories.map(category => {
                    category['enabled'] = true;
                    return category;
                });
            });
    }

    /**
     * Ensures that the resource categories are never undefined, only an empty array.
     */
    updateEnabledResourceCategories() {
        this.enabledResourceCategories = this.resourceCategories ? this.resourceCategories.filter(category => category['enabled']) : [];
    }

    /**
     * Sets the current view of the calendar to the provided value.
     * @param viewName The name of the calendar view.
     */
    setCurrentView(viewName: string) {
        AnalyticsService.sendEvent({category: 'Management - Calendar', action: 'ChangeView', label: viewName});
        this.currentView = viewName;
    }

    /**
     * Called when an event on the calendar is clicked on.
     * @param event The event clicked on.
     */
    onEventSelected(event: Reservation): void {
        AnalyticsService.sendEvent({category: 'Management - Calendar', action: 'ClickEvent'});
        this.reservationInfoModal.display(event);
    }

}