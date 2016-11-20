import {Component} from "@angular/core";
import {Reservation} from "../../../models/reservation.model";

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard-page.component.html'
})
export class DashboardPageComponent {

    onCalendarEventClicked(event: Reservation) {
        alert("Clicked: " + event.title);
    }

}