/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from '@angular/core';
import {ReservationService} from "../../../../services/singleton/reservation.service";
import {AuthService} from "../../../../services/singleton/auth.service";
import {User} from "../../../../models/user.model";
import {ReservationDetails} from "../../../../models/reservation-details.model";
import {ResourceCategory} from "../../../../models/resource-category.model";
import moment = require("moment");
import {Reservation} from "../../../../models/reservation.model";
import {ReservationDecision} from "../../../../models/reservation-decision.model";
import {UserGroup} from "../../../../models/user-group.model";

@Component({
    selector: 'pending-page',
    templateUrl: 'pending-page.component.html'
})
export class PendingPageComponent {
    user: User;
    pendingReservations: Reservation[]= [];
    behalfUserGroup: UserGroup;
    displayCategories: ResourceCategory[] = [];
    userGroupHierarchy: UserGroup[] = [];
    lowerApprovalOverrides: UserGroup[] = [];
    lowerRejectionOverrides: UserGroup[] = [];
    reservationDecisions: ReservationDecision[][] = [];

    constructor(private reservationService: ReservationService, authService: AuthService) {
        authService.getUser().subscribe(user => this.user = user);
        reservationService.getPendingReservations(this.user).subscribe(reservations => {
                this.pendingReservations = reservations;
                this.pendingReservations.forEach(reservation =>{
                    this.reservationService.getReservationDecisions(reservation).subscribe(decisions =>{
                        let reservationDecisions: ReservationDecision[];
                        reservationDecisions = decisions;

                        console.log("Size of decision list: " + reservationDecisions.length);
                        let userGroup: UserGroup[] = [];
                        reservationDecisions.forEach(item =>{
                            userGroup.push(item.userGroup);
                        });
                        let reachedUserGroup: boolean;
                        let behalfUserGroup: UserGroup;
                        reachedUserGroup = false;

                        userGroup.forEach(item => {
                            this.user.userGroups.forEach(userG => {
                                if (userG === item) {
                                    behalfUserGroup = userG;
                                    reachedUserGroup = true;
                                }
                            });
                            if(reachedUserGroup){
                                reservationDecisions.forEach(decision =>{
                                    if(decision.userGroup === behalfUserGroup){
                                        if(decision.reservation.approved == true){
                                            reservation.approved = true;
                                        }
                                    }else if(!decision.reservation.approved){
                                        reservation.approved = false;
                                    }
                                });
                            }

                        });

                        reachedUserGroup = false;
                        this.behalfUserGroup = behalfUserGroup;
                        //organize
                        reservation['organizeDecisions'] = reservationDecisions;
                    })
                });

        });
       // this.pendingReservations.forEach(item => this.displayCategories.push(item.resource.resourceCategory));

    }
    doStuff() {
        console.log("Size of reservations: " + this.pendingReservations.length); //prints 1
        let j = this.pendingReservations.length;
        let temp = this.pendingReservations;
        for (let i = 0; i <= j; i++) {
            this.reservationService.getReservationDecisions(temp[i]).subscribe(decisions => {
                    let decisionList: ReservationDecision[];
                    decisionList = decisions; //size is 1
                    this.reservationDecisions[i] = decisionList;
                }
            );

        }
      /*  if (this.reservationDecisions == undefined) {
            console.log("broken");
        } else {
            console.log("Size now: " + this.reservationDecisions[0].length); //this prints 0, should print 1
        }*/
    }

    formatFriendly(date: string){
        return moment(date);
    }

/*
    getReservationDecisions(reservation: Reservation){
        let reservationDecisions: ReservationDecision[] = [];
            console.log("passed if");
            this.reservationService.getReservationDecisions(reservation).subscribe(decisions =>
                reservationDecisions = decisions
            );

        this.organizeDecisions(reservationDecisions);
    }
*/

    organizeDecisions(reservationDecisions: ReservationDecision[]){
    }

}


/*
 TODO:
 * Get pending reservation resource categories, implement backend and front end services
 * Get reservation details for resource categories, implement backend and front end services
 * Get map from backend via Angular service
 * subscribe to service in component
 * Make Panels for reservations
 * Add backend methods for approve/rejection of reservations and implement into frontend
 * */