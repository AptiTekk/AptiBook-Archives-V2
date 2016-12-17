import {Component, ViewChild} from "@angular/core";
import {Reservation} from "../../models/reservation.model";
import {ModalComponent} from "../modal/modal.component";
import moment = require("moment");
import Moment = moment.Moment;

@Component({
    selector: 'reservation-info-modal',
    templateUrl: 'reservation-info-modal.component.html',
    styleUrls: ['reservation-info-modal.component.css']
})
export class ReservationInfoModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    reservation: Reservation;

    reservationStartMoment: Moment;
    reservationEndMoment: Moment;

    public display(reservation: Reservation) {
        this.reservation = reservation;
        this.reservationStartMoment = moment(reservation.start);
        this.reservationEndMoment = moment(reservation.end ? reservation.end : reservation.start);
        this.modal.openModal();
    }

    humanizeDifference(): string {
        return moment.duration(this.reservationEndMoment.diff(this.reservationStartMoment)).humanize();
    }

}