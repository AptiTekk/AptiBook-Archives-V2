import {Component} from "@angular/core";
import {APIService} from "../../../../services/singleton/api.service";
import {Reservation} from "../../../../models/reservation.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";

@Component({
    selector: 'my-reservations-page',
    templateUrl: 'reservations-page.component.html'
})
export class ReservationsPageComponent {

    user: User;
    reservations: Reservation[];

    constructor(protected apiService: APIService, authService: AuthService) {
        authService.getUser().subscribe(user => this.user = user);
    }

}