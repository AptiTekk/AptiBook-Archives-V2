import {Component} from "@angular/core";
import {Reservation} from "../../../models/reservation.model";
import {APIService} from "../../../services/api.service";

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard-page.component.html'
})
export class DashboardPageComponent {

    constructor(protected apiService: APIService) {}

    onCalendarEventClicked(event: Reservation) {
        alert("Clicked: " + event.title);
    }

}