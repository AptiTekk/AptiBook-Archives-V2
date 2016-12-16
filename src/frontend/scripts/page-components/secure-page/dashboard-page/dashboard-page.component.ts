import {Component, trigger, state, style, transition, animate, ViewChild} from "@angular/core";
import {Reservation} from "../../../models/reservation.model";
import {APIService} from "../../../services/singleton/api.service";
import {ReservationInfoModalComponent} from "../../../components/reservation-info-modal/reservation-info-modal.component";
import {AuthService} from "../../../services/singleton/auth.service";
import {User} from "../../../models/user.model";
import {ResourceCategoryService} from "../../../services/singleton/resource-category.service";
import {ResourceCategory} from "../../../models/resource-category.model";

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard-page.component.html',
    animations: [
        trigger('sidebarDisplayStatus', [
            state('visible', style({opacity: 1})),
            state('hidden', style({overflow: 'hidden', opacity: 0, 'height': '0', 'pointer-events': 'none'})),
            transition('* => *', animate('300ms'))
        ])
    ]
})
export class DashboardPageComponent {

    @ViewChild('reservationInfoModal')
    reservationInfoModal: ReservationInfoModalComponent;

    makingNewReservation: boolean = false;

    currentUser: User;

    resourceCategories: ResourceCategory[];
    enabledResourceCategories: ResourceCategory[];

    filterOnlyUsersEvents: boolean = false;

    constructor(protected apiService: APIService, authService: AuthService, private resourceCategoryService: ResourceCategoryService) {
        authService.getUser().subscribe(user => this.currentUser = user);

        this.resourceCategoryService.getResourceCategories().take(1).subscribe(resourceCategory => {
            this.resourceCategories = resourceCategory.map(category => {
                category['enabled'] = true;
                return category;
            });
        });
    }

    onCalendarEventClicked(event: Reservation) {
        this.reservationInfoModal.display(event);
    }

    onNewReservationStart() {
        this.makingNewReservation = true;
    }

    onCancelNewReservation() {
        this.makingNewReservation = false;
    }

    updateEnabledResourceCategories() {
        this.enabledResourceCategories = this.resourceCategories ? this.resourceCategories.filter(category => category['enabled']) : [];
    }

}