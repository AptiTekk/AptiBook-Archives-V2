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
} from "../../models/reservation/reservation.model";
import {ReplaySubject} from "rxjs";
import {UserGroup} from "../../models/user-group.model";
import {ReservationDecision} from "../../models/reservation/reservation-decision.model";
import {UserGroupService} from "./user-group.service";
import PriorityQueue from "typescript-collections/dist/lib/PriorityQueue";
import {User} from "../../models/user.model";
import {AuthService} from "./auth.service";
import {DecisionHierarchyRelation} from "../../models/reservation/decision-hierarchy-relation.model";

/**
 * This class contains logic needed for the reservation management page,
 * including getting pending/approved/rejected reservations, getting decisions, and making decisions.
 */
@Injectable()
export class ReservationManagementService {

    private user: User;
    private rootUserGroup: UserGroup;
    private pendingReservations = new ReplaySubject<ReservationWithUnorganizedDecisions[]>(1);
    private approvedReservations = new ReplaySubject<ReservationWithUnorganizedDecisions[]>(1);
    private rejectedReservations = new ReplaySubject<ReservationWithUnorganizedDecisions[]>(1);

    constructor(private apiService: APIService,
                private authService: AuthService,
                private userGroupService: UserGroupService) {

        authService.getCurrentUser().subscribe(user => this.user = user);
        userGroupService.getRootUserGroup().subscribe(root => this.rootUserGroup = root);
    }

    public fetchReservations(): void {
        this.apiService.get("reservations/pending")
            .then((reservations: ReservationWithUnorganizedDecisions[]) => {
                this.pendingReservations.next(reservations);
            });
        this.apiService.get("reservations/approved")
            .then((reservations: ReservationWithUnorganizedDecisions[]) => {
                this.approvedReservations.next(reservations);
            });
        this.apiService.get("reservations/rejected")
            .then((reservations: ReservationWithUnorganizedDecisions[]) => {
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

        // Add a queue. We will traverse down the tree.
        let userGroupTraversalQueue = new PriorityQueue<UserGroup>();
        userGroupTraversalQueue.add(this.rootUserGroup);

        // Traverse down the tree until we find the owner of the reservation's resource.
        let currentGroup: UserGroup;
        let ownerGroup: UserGroup;
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
        } else if (!organizedReservation.decisions) {
            console.error("Could not find reservation decisions; cannot organize them.");
        } else {

            currentGroup = ownerGroup;
            organizedReservation.decisionHierarchy = [];

            // Map reservation decisions to user groups
            do {
                // Assign a decision to the group, if they have made one.
                let filteredDecisions = organizedReservation.decisions.filter(decision => decision.userGroup.id === currentGroup.id);
                let decision = filteredDecisions.length > 0 ? filteredDecisions[0] : null;

                // Add a relation.
                let relation: DecisionHierarchyRelation = {
                    userGroup: currentGroup,
                    decision: decision
                };
                organizedReservation.decisionHierarchy.push(relation);

                // Check if this group is the one that the user is deciding for.
                if (this.user.userGroups.some(group => group.id === currentGroup.id))
                    organizedReservation.decidingFor = relation;

            } while ((currentGroup = currentGroup.parent));

            // It's time to figure out who overrides who!
            // We start at the top and work our way down.
            for (let i = organizedReservation.decisionHierarchy.length - 1; i >= 0; i--) {
                let thisRelation = organizedReservation.decisionHierarchy[i];
                let upperRelation = organizedReservation.decisionHierarchy[i + 1];

                if (upperRelation) { // If the upper relation exists...
                    if (upperRelation.overriddenBy) // If the upper relation has been overridden,
                        thisRelation.overriddenBy = upperRelation.overriddenBy; // then our relation is also overridden.
                    else if (upperRelation.decision) // If the upper relation hasn't been overridden, check if it has a decision.
                        if (!thisRelation.decision) // If it has a decision and we don't,
                            thisRelation.overriddenBy = upperRelation; // ... then it overrides us.
                        else if (upperRelation.decision.approved
                            != thisRelation.decision.approved)  // If we DO have a decision, and it is NOT the same as the upper group's decision...
                            thisRelation.overriddenBy = upperRelation; // ... then we are overridden by the upper group.
                }
            }

            // Reverse the hierarchy so that the uppermost relation is at the first index.
            organizedReservation.decisionHierarchy.reverse();
            return organizedReservation;
        }
    }

    /**
     * Makes a decision on the provided reservation.
     * @param approved If the decision is an approval or a rejection.
     * @param reservation The reservation deciding upon.
     * @returns A promise that gives the decision made.
     */
    makeDecision(approved: boolean, reservation: Reservation): Promise<ReservationDecision> {
        return new Promise((resolve, reject) => {
            this.apiService.patch("/reservations/" + reservation.id + "/decision", approved)
                .then(decision => resolve(decision))
                .catch(err => reject(err))
        });
    }

}