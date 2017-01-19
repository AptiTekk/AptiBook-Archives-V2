import {Component, ViewChild} from "@angular/core";
import * as moment from "moment";
import {Router} from "@angular/router";
import {SearchService} from "../../../../services/singleton/search.service";
import {ModalComponent} from "../../../../components/modal/modal.component";
import Moment = moment.Moment;

@Component({
    selector: 'new-reservation-modal',
    templateUrl: 'new-reservation-modal.component.html',
    styleUrls: ['new-reservation-modal.component.css'],
})
export class NewReservationModalComponent {

    @ViewChild(ModalComponent) modal: ModalComponent;

    startDate: Moment = moment();
    endDate: Moment = moment();

    constructor(private searchService: SearchService, private router: Router) {
        searchService.clearResults();
    }

    get isEndBeforeStart() {
        return this.endDate.isBefore(this.startDate);
    }

    public display(date: Moment) {
        this.startDate = date;
        this.endDate = date;
        this.modal.openModal();
    }

    onSearch() {
        this.searchService.searchForResources(this.startDate, this.endDate);
        this.modal.closeModal();
        this.router.navigate(['', 'secure', 'search-results']);
    }

}
