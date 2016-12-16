import {Component} from "@angular/core";
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {Reservation} from "../../../../models/reservation.model";

@Component({
    selector: 'success-page',
    templateUrl: 'success-page.component.html'
})
export class SuccessPageComponent {

    reservation: Reservation;

    constructor(reservationService: ReservationService) {
        reservationService.getLastReservationMade().subscribe(reservation => this.reservation = reservation);
    }
}