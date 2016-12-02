import {Component, trigger, state, style, transition, animate, ViewChild} from "@angular/core";
import {Reservation} from "../../../models/reservation.model";
import {APIService} from "../../../services/singleton/api.service";
import {ReservationInfoModalComponent} from "../../../components/reservation-info-modal/reservation-info-modal.component";

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard-page.component.html',
    animations: [
        trigger('sidebarDisplayStatus', [
            state('visible', style({opacity: 1})),
            state('hidden', style({overflow: 'hidden', opacity: 0, 'height': '0', 'pointer-events': 'none'})),
            transition('* => *', animate('200ms'))
        ])
    ]
})
export class DashboardPageComponent {

    @ViewChild('reservationInfoModal')
    reservationInfoModal: ReservationInfoModalComponent;

    makingNewReservation: boolean = false;

    constructor(protected apiService: APIService) {
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

}