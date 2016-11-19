import {Component} from "@angular/core";
import {Reservation} from "../../../../models/reservation.model";

@Component({
    selector: 'upcoming-reservations-panel',
    templateUrl: 'upcoming-reservations-panel.component.html',
    styleUrls: ['upcoming-reservations-panel.component.css']
})
export class UpcomingReservationsPanelComponent {

    upcomingReservations: Reservation[] = [
        {
            id: 10,
            title: 'CRT Testing',
            status: 'APPROVED',
            dateCreated: '11/10/2016 2:00 PM',
            start: '11/18/2016 3:00 PM',
            end: '11/18/2016 4:00 PM',
            resource: 1,
            user: 1,
            decisions: [1],
            fieldEntries: [1]
        },
        {
            id: 10,
            title: 'Book Club',
            status: 'APPROVED',
            dateCreated: '11/10/2016 2:00 PM',
            start: '11/18/2016 3:00 PM',
            end: '11/18/2016 4:00 PM',
            resource: 1,
            user: 1,
            decisions: [1],
            fieldEntries: [1]
        },
        {
            id: 10,
            title: 'Essay Research',
            status: 'PENDING',
            dateCreated: '11/10/2016 2:00 PM',
            start: '11/18/2016 3:00 PM',
            end: '11/18/2016 4:00 PM',
            resource: 2,
            user: 1,
            decisions: [1],
            fieldEntries: [1]
        },
        {
            id: 10,
            title: 'CRT Testing',
            status: 'APPROVED',
            dateCreated: '11/10/2016 2:00 PM',
            start: '11/18/2016 3:00 PM',
            end: '11/18/2016 4:00 PM',
            resource: 1,
            user: 1,
            decisions: [1],
            fieldEntries: [1]
        },
        {
            id: 10,
            title: 'CRT Testing',
            status: 'APPROVED',
            dateCreated: '11/10/2016 2:00 PM',
            start: '11/18/2016 3:00 PM',
            end: '11/18/2016 4:00 PM',
            resource: 1,
            user: 1,
            decisions: [1],
            fieldEntries: [1]
        }
    ];

    //noinspection JSMethodCanBeStatic
    getStatusLabelText(reservation: Reservation) {
        return reservation.status === "APPROVED" ? "Approved" : reservation.status === "PENDING" ? "Pending" : "Unknown";
    }

    //noinspection JSMethodCanBeStatic
    getStatusLabelClassSuffix(reservation: Reservation) {
        return reservation.status === "APPROVED" ? "success" : reservation.status === "PENDING" ? "default" : "warning";
    }

}