import {Component, Output, EventEmitter} from "@angular/core";
import * as moment from "moment";
import {ResourceService} from "../../../../services/singleton/resource.service";
import Moment = moment.Moment;

@Component({
    selector: 'new-reservation-panel',
    templateUrl: 'new-reservation-panel.component.html',
    styleUrls: ['new-reservation-panel.component.css'],
})
export class NewReservationPanelComponent {

    @Output()
    cancelled: EventEmitter<void> = new EventEmitter<void>();

    startDate: Moment = moment();
    endDate: Moment = moment();

    constructor(private resourceService: ResourceService) {

    }

    get isEndBeforeStart() {
        return this.endDate.isBefore(this.startDate);
    }

    onCancel() {
        this.cancelled.next();
    }

    onSearch() {
        this.resourceService.fetchAvailableResources(this.startDate, this.endDate);
    }

}