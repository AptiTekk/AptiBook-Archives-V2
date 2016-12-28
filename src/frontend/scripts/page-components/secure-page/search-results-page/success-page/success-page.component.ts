import {Component} from "@angular/core";
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {Reservation} from "../../../../models/reservation.model";
import {APIService} from "../../../../services/singleton/api.service";

@Component({
    selector: 'success-page',
    templateUrl: 'success-page.component.html'
})
export class SuccessPageComponent {

    reservation: Reservation;

    constructor(protected apiService: APIService, reservationService: ReservationService) {
        reservationService.getLastReservationMade().subscribe(reservation => this.reservation = reservation);
    }
}