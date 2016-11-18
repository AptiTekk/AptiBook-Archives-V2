import {Component} from "@angular/core";
import {APIService} from "../../../services/api.service";

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard-page.component.html'
})
export class DashboardPageComponent {

    constructor(public apiService: APIService) {

    }

    onCalendarEventClicked(id: number) {
        alert("Clicked: "+id);
    }

}