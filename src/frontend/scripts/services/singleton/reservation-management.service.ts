/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {
    Reservation,
    ReservationWithOrganizedDecisions,
    ReservationWithUnorganizedDecisions
} from "../../models/reservation.model";
import {Observable, ReplaySubject} from "rxjs";
import {UserGroup, UserGroupWithDecision} from "../../models/user-group.model";
import {ReservationDecision} from "../../models/reservation-decision.model";
import {UserGroupService} from "./usergroup.service";
import PriorityQueue from "typescript-collections/dist/lib/PriorityQueue";

/**
 * This class contains logic needed for the reservation management page;
 * including getting pending/approved/rejected reservations, getting decisions, and making decisions.
 */
@Injectable()
export class ReservationManagementService {

    private rootUserGroup: UserGroup;
    private pendingReservations = new ReplaySubject<ReservationWithUnorganizedDecisions[]>(1);
    private approvedReservations = new ReplaySubject<ReservationWithUnorganizedDecisions[]>(1);
    private rejectedReservations = new ReplaySubject<ReservationWithUnorganizedDecisions[]>(1);

    constructor(private apiService: APIService,
                private userGroupService: UserGroupService) {
        this.userGroupService
            .getRootUserGroup()
            .subscribe(
                rootGroup => {
                    this.rootUserGroup = rootGroup;
                    this.fetchReservations();
                });
    }

    public fetchReservations(): void {
        this.apiService
            .get("reservations/pending")
            .take(1)
            .subscribe((reservations: ReservationWithUnorganizedDecisions[]) => {
                this.pendingReservations.next(reservations);
            });
        this.apiService
            .get("reservations/approved")
            .take(1)
            .subscribe((reservations: ReservationWithUnorganizedDecisions[]) => {
                this.approvedReservations.next(reservations);
            });
        this.apiService
            .get("reservations/rejected")
            .take(1)
            .subscribe((reservations: ReservationWithUnorganizedDecisions[]) => {
                this.rejectedReservations.next(reservations);
            });
    }

    /**
     * @returns {ReplaySubject<ReservationWithUnorganizedDecisions[]>} The ReplaySubject containing the Pending Reservations (whose decisions are not originally organized). <br/>
     * Will be an empty array if an error occurs.
     */
    public getPendingReservations(): ReplaySubject<ReservationWithUnorganizedDecisions[]> {
        return this.pendingReservations;
    }

    /**
     * @returns {ReplaySubject<ReservationWithUnorganizedDecisions[]>} The ReplaySubject containing the Approved Reservations (whose decisions are not originally organized). <br/>
     * Will be an empty array if an error occurs.
     */
    public getApprovedReservations(): ReplaySubject<ReservationWithUnorganizedDecisions[]> {
        return this.approvedReservations;
    }

    /**
     * @returns {ReplaySubject<ReservationWithUnorganizedDecisions[]>} The ReplaySubject containing the Rejected Reservations (whose decisions are not originally organized). <br/>
     * Will be an empty array if an error occurs.
     */
    public getRejectedReservations(): ReplaySubject<ReservationWithUnorganizedDecisions[]> {
        return this.rejectedReservations;
    }

    /**
     * Destructively organizes the decisions of the hierarchies of the passed in reservation.
     * Determines who overrides who, which decisions belong to which groups, etc.
     * @param reservation The reservation to organize.
     * @returns The organized reservation (same reservation passed in)
     */
    public organizeReservation(reservation: ReservationWithUnorganizedDecisions): ReservationWithOrganizedDecisions {
        let organizedReservation: ReservationWithOrganizedDecisions = reservation;

        // Start by cloning the root group. (Instead of making a bunch of unnecessary requests)
        let rootGroup: UserGroupWithDecision = jQuery.extend(true, {}, this.rootUserGroup);

        // Add a queue. We will traverse down the tree.
        let userGroupTraversalQueue = new PriorityQueue<UserGroupWithDecision>();
        userGroupTraversalQueue.add(rootGroup);

        // Traverse down the tree until we find the owner of the reservation's resource.
        let currentGroup: UserGroupWithDecision;
        let ownerGroup: UserGroupWithDecision;
        while ((currentGroup = userGroupTraversalQueue.dequeue())) {
            if (organizedReservation.resource.owner.id === currentGroup.id) {
                ownerGroup = currentGroup;
                break;
            }

            if (currentGroup.children) {
                for (let childGroup of currentGroup.children) {
                    userGroupTraversalQueue.add(childGroup);
                    childGroup.parent = currentGroup;
                }
            }
        }

        // The owner should have been found.
        if (!ownerGroup) {
            console.error("Could not find owner of reservation resource; cannot organize decisions.");
        } else {

            // Now, make a list of the user groups in the branch that the owner group is in,
            // starting from the owner group and working UP. (Hierarchy Up)
            let userGroupsOfReservation: UserGroupWithDecision[] = [ownerGroup];
            currentGroup = ownerGroup;
            while ((currentGroup = currentGroup.parent)) {
                userGroupsOfReservation.push(currentGroup);
            }

            // Take the Decisions, and assign them to the correct User Groups.
            organizedReservation.decisions.forEach(decision => {
                userGroupsOfReservation.forEach(userGroup => {
                    if (decision.userGroup.id == userGroup.id) {
                        userGroup.decision = decision;
                    }
                });
            });

            // It's time to figure out who overrides who!
            // We start at the top and work our way down.
            for (let i = userGroupsOfReservation.length - 1; i >= 0; i--) {
                let thisGroup = userGroupsOfReservation[i];
                let upperGroup = userGroupsOfReservation[i + 1];

                if (upperGroup) { // If the upper group exists...
                    if (upperGroup.overriddenBy) // If the upper group has been overridden by another group
                        thisGroup.overriddenBy = upperGroup.overriddenBy; // then we are also overridden by that group.
                    else if (upperGroup.decision) // If the upper group has NOT been overridden, check if the upper group has made a decision.
                        if (!thisGroup.decision) // If they have a decision but we do NOT...
                            thisGroup.overriddenBy = upperGroup; // ... then we are overridden by the upper group.
                        else if (upperGroup.decision.approved
                            != thisGroup.decision.approved)  // If we DO have a decision, and it is NOT the same as the upper group's decision...
                            thisGroup.overriddenBy = upperGroup; // ... then we are overridden by the upper group.
                }
            }

            // We will reverse the array so that it shows up in the correct order on the web-page.
            organizedReservation.hierarchy = userGroupsOfReservation.reverse();
            return organizedReservation;
        }
    }

    /**
     * Makes a decision on the provided reservation.
     * @param approved If the decision is an approval or a rejection.
     * @param reservation The reservation deciding upon.
     * @returns The decision that was made, or undefined if one could not be made.
     */
    makeDecision(approved: boolean, reservation: Reservation): Observable<ReservationDecision> {
        return Observable.create(listener => {
            if (!reservation)
                listener.next(undefined);
            else
                this.apiService
                    .patch("/reservations/" + reservation.id + "/decide", approved)
                    .subscribe(
                        decision => listener.next(decision),
                        err => listener.next(undefined)
                    )
        });
    }

}