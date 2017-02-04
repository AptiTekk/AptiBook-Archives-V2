import {Component} from "@angular/core";
import {Reservation} from "../../../../models/reservation.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {ReservationService} from "../../../../services/singleton/reservation.service";

@Component({
    selector: 'upcoming-reservations',
    templateUrl: 'upcoming-reservations.component.html',
    styleUrls: ['upcoming-reservations.component.css']
})
export class UpcomingReservationsComponent {

    reservations: Reservation[];

    constructor(authService: AuthService, reservationService: ReservationService) {
        authService.getUser().subscribe(user => {
            if (user)
                reservationService.getUpcomingUserReservations(user).subscribe(reservations => this.reservations = reservations);
        });
    }

    //noinspection JSMethodCanBeStatic
    getStatusLabelText(reservation: Reservation) {
        return reservation.approved ? "Approved" : reservation.pending ? "Pending" : "Unknown";
    }

    //noinspection JSMethodCanBeStatic
    getStatusLabelClassSuffix(reservation: Reservation) {
        return reservation.approved ? "success" : reservation.pending ? "default" : "warning";
    }

}