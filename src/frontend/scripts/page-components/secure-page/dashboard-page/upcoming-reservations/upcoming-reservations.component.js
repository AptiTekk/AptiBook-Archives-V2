/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
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
var core_1 = require("@angular/core");
var auth_service_1 = require("../../../../services/singleton/auth.service");
var reservation_service_1 = require("../../../../services/singleton/reservation.service");
var UpcomingReservationsComponent = (function () {
    function UpcomingReservationsComponent(authService, reservationService) {
        var _this = this;
        authService.getUser().subscribe(function (user) {
            if (user)
                reservationService.getUpcomingUserReservations(user).subscribe(function (reservations) { return _this.reservations = reservations; });
        });
    }
    //noinspection JSMethodCanBeStatic
    UpcomingReservationsComponent.prototype.getStatusLabelText = function (reservation) {
        return reservation.approved ? "Approved" : reservation.pending ? "Pending" : "Unknown";
    };
    //noinspection JSMethodCanBeStatic
    UpcomingReservationsComponent.prototype.getStatusLabelClassSuffix = function (reservation) {
        return reservation.approved ? "success" : reservation.pending ? "default" : "warning";
    };
    return UpcomingReservationsComponent;
}());
UpcomingReservationsComponent = __decorate([
    core_1.Component({
        selector: 'upcoming-reservations',
        templateUrl: 'upcoming-reservations.component.html',
        styleUrls: ['upcoming-reservations.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService, reservation_service_1.ReservationService])
], UpcomingReservationsComponent);
exports.UpcomingReservationsComponent = UpcomingReservationsComponent;
//# sourceMappingURL=upcoming-reservations.component.js.map