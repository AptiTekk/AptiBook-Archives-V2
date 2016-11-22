import {Component, Output, EventEmitter, trigger, state, style, transition, animate} from "@angular/core";
import * as moment from "moment";
import Moment = moment.Moment;

@Component({
    selector: 'new-reservation-panel',
    templateUrl: 'new-reservation-panel.component.html',
    styleUrls: ['new-reservation-panel.component.css'],
    /*animations: [
        trigger('stepDisplayStatus', [
            state('visible', style({opacity: 1})),
            state('hidden', style({display: 'none', opacity: 0, 'pointer-events': 'none'})),
            transition('* => *', animate('200ms'))
        ])
    ]*/
})
export class NewReservationPanelComponent {

    @Output()
    cancelled: EventEmitter<void> = new EventEmitter<void>();

    step: number = 0;

    startDate: Moment = moment();
    startTime: Moment = moment();

    endDate: Moment = moment();
    endTime: Moment = moment();

    onCancel() {
        this.cancelled.next();
    }

    onNext() {
        this.step++;
    }

    onPrevious() {
        this.step--;
    }

    onSearch() {

    }

}