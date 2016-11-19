import {Component} from "@angular/core";
import {APIService} from "../../../services/api.service";
import {TenantService} from "../../../services/tenant.service";
import {Reservation} from "../../../models/reservation.model";

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard-page.component.html'
})
export class DashboardPageComponent {

    private timezone: string;

    constructor(public apiService: APIService, private tenantService: TenantService) {
        tenantService.getTenant().subscribe(tenant => this.timezone = tenant.timezone)
    }

    onCalendarEventClicked(event: Reservation) {
        alert("Clicked: " + event.title);
    }

}