"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
var core_1 = require("@angular/core");
var api_service_1 = require("./api.service");
var rxjs_1 = require("rxjs");
var usergroup_service_1 = require("./usergroup.service");
var PriorityQueue_1 = require("typescript-collections/dist/lib/PriorityQueue");
var auth_service_1 = require("./auth.service");
/**
 * This class contains logic needed for the reservation management page,
 * including getting pending/approved/rejected reservations, getting decisions, and making decisions.
 */
var ReservationManagementService = (function () {
    function ReservationManagementService(apiService, authService, userGroupService) {
        var _this = this;
        this.apiService = apiService;
        this.authService = authService;
        this.userGroupService = userGroupService;
        this.pendingReservations = new rxjs_1.ReplaySubject(1);
        this.approvedReservations = new rxjs_1.ReplaySubject(1);
        this.rejectedReservations = new rxjs_1.ReplaySubject(1);
        authService.getUser().subscribe(function (user) { return _this.user = user; });
        userGroupService.getRootUserGroup().subscribe(function (root) { return _this.rootUserGroup = root; });
    }
    ReservationManagementService.prototype.fetchReservations = function () {
        var _this = this;
        this.apiService
            .get("reservations/pending")
            .take(1)
            .subscribe(function (reservations) {
            _this.pendingReservations.next(reservations);
        });
        this.apiService
            .get("reservations/approved")
            .take(1)
            .subscribe(function (reservations) {
            _this.approvedReservations.next(reservations);
        });
        this.apiService
            .get("reservations/rejected")
            .take(1)
            .subscribe(function (reservations) {
            _this.rejectedReservations.next(reservations);
        });
    };
    /**
     * @returns {ReplaySubject<ReservationWithUnorganizedDecisions[]>} The ReplaySubject containing the Pending Reservations (whose decisions are not originally organized). <br/>
     * Will be an empty array if an error occurs.
     */
    ReservationManagementService.prototype.getPendingReservations = function () {
        return this.pendingReservations;
    };
    /**
     * @returns {ReplaySubject<ReservationWithUnorganizedDecisions[]>} The ReplaySubject containing the Approved Reservations (whose decisions are not originally organized). <br/>
     * Will be an empty array if an error occurs.
     */
    ReservationManagementService.prototype.getApprovedReservations = function () {
        return this.approvedReservations;
    };
    /**
     * @returns {ReplaySubject<ReservationWithUnorganizedDecisions[]>} The ReplaySubject containing the Rejected Reservations (whose decisions are not originally organized). <br/>
     * Will be an empty array if an error occurs.
     */
    ReservationManagementService.prototype.getRejectedReservations = function () {
        return this.rejectedReservations;
    };
    /**
     * Destructively organizes the decisions of the hierarchies of the passed in reservation.
     * Determines who overrides who, which decisions belong to which groups, etc.
     * @param reservation The reservation to organize.
     * @returns The organized reservation (same reservation passed in)
     */
    ReservationManagementService.prototype.organizeReservation = function (reservation) {
        var organizedReservation = reservation;
        // Add a queue. We will traverse down the tree.
        var userGroupTraversalQueue = new PriorityQueue_1.default();
        userGroupTraversalQueue.add(this.rootUserGroup);
        // Traverse down the tree until we find the owner of the reservation's resource.
        var currentGroup;
        var ownerGroup;
        while ((currentGroup = userGroupTraversalQueue.dequeue())) {
            if (organizedReservation.resource.owner.id === currentGroup.id) {
                ownerGroup = currentGroup;
                break;
            }
            if (currentGroup.children) {
                for (var _i = 0, _a = currentGroup.children; _i < _a.length; _i++) {
                    var childGroup = _a[_i];
                    userGroupTraversalQueue.add(childGroup);
                    childGroup.parent = currentGroup;
                }
            }
        }
        // The owner should have been found.
        if (!ownerGroup) {
            console.error("Could not find owner of reservation resource; cannot organize decisions.");
        }
        else if (!organizedReservation.decisions) {
            console.error("Could not find reservation decisions; cannot organize them.");
        }
        else {
            currentGroup = ownerGroup;
            organizedReservation.decisionHierarchy = [];
            do {
                // Assign a decision to the group, if they have made one.
                var filteredDecisions = organizedReservation.decisions.filter(function (decision) { return decision.userGroup.id === currentGroup.id; });
                var decision = filteredDecisions.length > 0 ? filteredDecisions[0] : null;
                // Add a relation.
                var relation = {
                    userGroup: currentGroup,
                    decision: decision
                };
                organizedReservation.decisionHierarchy.push(relation);
                // Check if this group is the one that the user is deciding for.
                if (this.user.userGroups.some(function (group) { return group.id === currentGroup.id; }))
                    organizedReservation.decidingFor = relation;
            } while ((currentGroup = currentGroup.parent));
            // It's time to figure out who overrides who!
            // We start at the top and work our way down.
            for (var i = organizedReservation.decisionHierarchy.length - 1; i >= 0; i--) {
                var thisRelation = organizedReservation.decisionHierarchy[i];
                var upperRelation = organizedReservation.decisionHierarchy[i + 1];
                if (upperRelation) {
                    if (upperRelation.overriddenBy)
                        thisRelation.overriddenBy = upperRelation.overriddenBy; // then our relation is also overridden.
                    else if (upperRelation.decision)
                        if (!thisRelation.decision)
                            thisRelation.overriddenBy = upperRelation; // ... then it overrides us.
                        else if (upperRelation.decision.approved
                            != thisRelation.decision.approved)
                            thisRelation.overriddenBy = upperRelation; // ... then we are overridden by the upper group.
                }
            }
            // Reverse the hierarchy so that the uppermost relation is at the first index.
            organizedReservation.decisionHierarchy.reverse();
            return organizedReservation;
        }
    };
    /**
     * Makes a decision on the provided reservation.
     * @param approved If the decision is an approval or a rejection.
     * @param reservation The reservation deciding upon.
     * @returns The decision that was made, or undefined if one could not be made.
     */
    ReservationManagementService.prototype.makeDecision = function (approved, reservation) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService
                .patch("/reservations/" + reservation.id + "/decision", approved)
                .subscribe(function (decision) { return listener.next(decision); }, function (err) { return listener.error(err); });
        });
    };
    return ReservationManagementService;
}());
ReservationManagementService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService,
        auth_service_1.AuthService,
        usergroup_service_1.UserGroupService])
], ReservationManagementService);
exports.ReservationManagementService = ReservationManagementService;
//# sourceMappingURL=reservation-management.service.js.map