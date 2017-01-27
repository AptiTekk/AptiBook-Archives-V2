import {Component} from "@angular/core";
import {Resource} from "../../../../models/resource.model";
import {ReservationDetailsService} from "../../../../services/singleton/reservation-details.service";
import {SearchService} from "../../../../services/singleton/search.service";
import {User} from "../../../../models/user.model";
import {AuthService} from "../../../../services/singleton/auth.service";
import {Reservation} from "../../../../models/reservation.model";
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {Router} from "@angular/router";
import {APIService} from "../../../../services/singleton/api.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import Moment = moment.Moment;
import moment = require("moment");
@Component({
    selector: 'reservation-details-page',
    templateUrl: 'reservation-details-page.component.html',
    styleUrls: ['reservation-details-page.component.css']
})
export class ReservationDetailsComponent {

    resource: Resource;
    start: Moment;
    end: Moment;
    user: User;

    formGroup: FormGroup;

    constructor(protected apiService: APIService,
                private formBuilder: FormBuilder,
                private reservationDetailsService: ReservationDetailsService,
                private searchService: SearchService,
                private authService: AuthService,
                private reservationService: ReservationService,
                private router: Router) {

        this.formGroup = formBuilder.group({
            title: [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("[^<>;=]*")])]
        });

        authService.getUser().subscribe(user => {
            if (user != undefined) {
                this.user = user;
            }
        });
        this.resource = reservationDetailsService.getResource();
        searchService.getStartTime().subscribe(start => this.start = start);
        searchService.getEndTime().subscribe(end => this.end = end);
    }

    reserve() {
        let reservation: Reservation = {};
        reservation.user = this.user;
        reservation.title = this.formGroup.controls['title'].value;
        reservation.start = this.start.toISOString();
        reservation.end = this.end.toISOString();
        reservation.resource = this.resource;

        this.reservationService.makeReservation(reservation).subscribe(newReservation => {
            if (newReservation) {
                this.router.navigateByUrl("/secure/search-results/success");
            }
        })
    }

}