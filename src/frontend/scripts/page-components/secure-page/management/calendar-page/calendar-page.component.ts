/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, ViewChild} from '@angular/core';
import {UserGroupService} from "../../../../services/singleton/usergroup.service";
import {UserGroup} from "../../../../models/user-group.model";
import {APIService} from "../../../../services/singleton/api.service";
import {ResourceCategoryService} from "../../../../services/singleton/resource-category.service";
import {ReservationInfoModalComponent} from "../../../../components/reservation-info-modal/reservation-info-modal.component";
import {User} from "../../../../models/user.model";
import {ResourceCategory} from "../../../../models/resource-category.model";
import {Reservation} from "../../../../models/reservation.model";
import {AuthService} from "../../../../services/singleton/auth.service";

@Component({
    selector: 'calendar-page',
    templateUrl: 'calendar-page.component.html'
})
export class CalendarPageComponent{
    @ViewChild('reservationInfoModal')
    reservationInfoModal: ReservationInfoModalComponent;

    userGroupOwnerFilter: UserGroup[];
    currentUser: User;
    resourceCategories: ResourceCategory[];
    enabledResourceCategories: ResourceCategory[];
    filterOnlyUsersEvents: boolean = false;

    onCalendarEventClicked(event: Reservation) {
        this.reservationInfoModal.display(event);
    }


    updateEnabledResourceCategories() {
        this.enabledResourceCategories = this.resourceCategories ? this.resourceCategories.filter(category => category['enabled']) : [];
    }

    constructor(private userGroupService: UserGroupService, private apiService: APIService, private resourceCategoryService: ResourceCategoryService, private authService: AuthService) {
        authService.getUser().subscribe(user => this.currentUser = user);
        userGroupService.getUserGroupHierarchyDownFilter();
        userGroupService.getUserGroupHierarchyDown().take(1).subscribe(response =>
            this.userGroupOwnerFilter = response
        );

        this.resourceCategoryService.getResourceCategories().take(1).subscribe(resourceCategory => {
            this.resourceCategories = resourceCategory.map(category => {
                category['enabled'] = true;
                return category;
            });
        });
    }
}