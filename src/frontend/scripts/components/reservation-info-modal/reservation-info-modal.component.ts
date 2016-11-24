import {Component, ViewChild} from "@angular/core";
import {Reservation} from "../../models/reservation.model";
import {ModalComponent} from "../modal/modal.component";

@Component({
    selector: 'reservation-info-modal',
    templateUrl: 'reservation-info-modal.component.html',
    styleUrls: ['reservation-info-modal.component.css']
})
export class ReservationInfoModalComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    reservation: Reservation;

    public display(reservation: Reservation) {
        this.reservation = reservation;
        this.modal.openModal();
    }

}