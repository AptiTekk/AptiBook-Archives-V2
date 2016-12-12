import {Component, Output, EventEmitter} from "@angular/core";
import * as moment from "moment";
import {Router} from "@angular/router";
import {SearchService} from "../../../../services/singleton/search.service";
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

    constructor(private searchService: SearchService, private router: Router) {
        searchService.clearResults();
    }

    get isEndBeforeStart() {
        return this.endDate.isBefore(this.startDate);
    }

    onCancel() {
        this.cancelled.next();
    }

    onSearch() {
        this.searchService.searchForResources(this.startDate, this.endDate);
        this.router.navigateByUrl("/secure/results-container/search-results");
    }

}
