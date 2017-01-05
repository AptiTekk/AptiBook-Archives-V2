import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, ReplaySubject} from "rxjs";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import * as moment from "moment";
import {ResourceCategory} from "../../models/resource-category.model";
import {ReservationDetails} from "../../models/reservation-details.model";
import {Response} from "@angular/http";
import {ReservationDecision} from "../../models/reservation-decision.model";

@Injectable()
export class ReservationService {

    private lastReservationMade: ReplaySubject<Reservation> = new ReplaySubject<Reservation>(1);
    /*
    private pendingReservationDetails: ReplaySubject<ReservationDetails[]> = new ReplaySubject<ReservationDetails[]>(1);
    private pendingReservationResourceCategories: ReplaySubject<ReservationDetails[]> = new ReplaySubject<ReservationDetails[]>(1);


    getPendingReservationDetailsList(): ReplaySubject<ReservationDetails[]>{
        return this.pendingReservationDetails;
    }

    getPendingReservationResourceCategoriesList(){
        return this.pendingReservationResourceCategories;
    }*/

    constructor(private apiService: APIService) {
    }

    public getUpcomingUserReservations(user: User): Observable<Reservation[]> {
        return Observable.create(listener => {
            if (user == undefined)
                listener.next(undefined);
            else
                this.apiService.get("reservations/user/" + user.id + "?start=" + moment().utc().format("YYYY-MM-DDTHH:mm:ss")).subscribe(
                    response => listener.next(<Reservation[]>response),
                    err => listener.next(undefined)
                )
        });
    }
//TODO: get rid of listener next, not used since replay subject, and get rid of observable
    public makeReservation(reservation: Reservation): Observable<Reservation> {
        return Observable.create(listener => {
            let body = JSON.stringify(reservation);
            this.apiService.post("reservations/user/" + reservation.user.id, body).subscribe(
                response => {
                    let reservation: Reservation = <Reservation>response;
                    listener.next(reservation);
                    this.lastReservationMade.next(reservation)
                },
                err => listener.next(undefined)
            );

        });
    }


    public getPendingReservationDetails(user: User): Observable<ReservationDetails[]> {
        return Observable.create(listener => {
            if (user == undefined) {
                listener.next(undefined);
                console.log("user is error")
            }
            else {
                this.apiService.get("reservations/pending/details/user/" + user.id).subscribe(
                    response => {
                        listener.next(<ReservationDetails[]>response);
                        console.log("no error in service");
                    },
                    err => {
                        console.log("error in service");
                        listener.next(undefined)
                    }
                );
                console.log("user is fine");
            }
        });
    }

    public getReservationDecisions(reservation: Reservation): Observable<ReservationDecision[]>{
        console.log("in function");
        return Observable.create(listener =>{
            this.apiService.get("reservations/decisions/" + reservation.id).subscribe(
                response =>{
                    console.log("response is perfect");
                    listener.next(response);
                },
                err => listener.next(undefined)
            )
        })
    }


    public getPendingReservations(user: User): Observable<Reservation[]> {
        return Observable.create(listener => {
            if (user == undefined) {
                listener.next(undefined);
                console.log("user is error")
            }
            else {
                this.apiService.get("reservations/pending/user/" + user.id).subscribe(
                    response => {
                        listener.next(<ResourceCategory[]>response);
                        console.log("no error in service");
                    },
                    err => {
                        console.log("error in service");
                        listener.next(undefined)
                    }
                );
                console.log("user is fine");
            }
        });
    }


    getLastReservationMade(): ReplaySubject<Reservation> {
        return this.lastReservationMade;
    }

}