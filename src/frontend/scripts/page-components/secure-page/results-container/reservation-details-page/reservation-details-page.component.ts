
import {Component, ViewEncapsulation} from "@angular/core";
import {Resource} from "../../../../models/resource.model";
import {ReservationDetailsService} from "../../../../services/singleton/reservation-details.service";
import Moment = moment.Moment;
import moment = require("moment");
import {SearchService} from "../../../../services/singleton/search.service";
import {User} from "../../../../models/user.model";
import {UserService} from "../../../../services/singleton/user.service";
import {AuthService} from "../../../../services/singleton/auth.service";
import {Reservation} from "../../../../models/reservation.model";
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {Router} from "@angular/router";
@Component({
    selector: 'reservation-details-page',
    templateUrl: 'reservation-details-page.component.html'
})
export class ReservationDetailsComponent{

    reservation: Reservation = {
        id: null,
        dateCreated: null,
        title: null,
        status: null,
        start: null,
        end: null,
        resource: null,
        user: null,
        decisions: null,
        fieldEntries: null,
        pending: null,
        approved: null,
        rejected: null,
        cancelled: null
    };
    resource: Resource;
    title: string;
    start: Moment;
    end: Moment;
    user: User;
   // private reservationDetailsService: ReservationDetailsService;

    constructor(private reservationDetailsService: ReservationDetailsService, private searchService: SearchService, private authService: AuthService, private reservationService: ReservationService, private router: Router){
        authService.getUser().subscribe(user =>{
            if(user != undefined) {
                this.user = user;
            }
        });
        this.resource = reservationDetailsService.getResource();
        searchService.getStartTime().subscribe(start => this.start = start);
        searchService.getEndTime().subscribe(end => this.end = end);
    }



    reserve(){
        // TODO: make new reservation from service, add reservation fields
        this.reservation.user = this.user;
        this.reservation.title = this.title;
        this.reservation.start = this.start;
        this.reservation.end = this.end;
        console.log("start: " + this.start);
        this.reservation.resource = this.resource;
        this.reservationService.makeReservation(this.reservation).subscribe(reservation => {
            if(reservation != null && reservation != undefined){
                this.router.navigateByUrl("/secure/search-results/success");
                console.log("it works");
                //redirect
            }
        })
    }

}