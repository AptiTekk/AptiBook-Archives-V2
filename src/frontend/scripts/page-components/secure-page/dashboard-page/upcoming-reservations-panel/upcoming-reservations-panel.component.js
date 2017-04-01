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
var core_1 = require("@angular/core");
var auth_service_1 = require("../../../../services/singleton/auth.service");
var reservation_service_1 = require("../../../../services/singleton/reservation.service");
var UpcomingReservationsPanelComponent = (function () {
    function UpcomingReservationsPanelComponent(authService, reservationService) {
        var _this = this;
        authService.getUser().subscribe(function (user) {
            if (user)
                reservationService.getUpcomingUserReservations(user).subscribe(function (reservations) { return _this.reservations = reservations; });
        });
    }
    //noinspection JSMethodCanBeStatic
    UpcomingReservationsPanelComponent.prototype.getStatusLabelText = function (reservation) {
        return reservation.approved ? "Approved" : reservation.pending ? "Pending" : "Unknown";
    };
    //noinspection JSMethodCanBeStatic
    UpcomingReservationsPanelComponent.prototype.getStatusLabelClassSuffix = function (reservation) {
        return reservation.approved ? "success" : reservation.pending ? "default" : "warning";
    };
    UpcomingReservationsPanelComponent = __decorate([
        core_1.Component({
            selector: 'upcoming-reservations-panel',
            templateUrl: 'upcoming-reservations-panel.component.html',
            styleUrls: ['upcoming-reservations-panel.component.css']
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, reservation_service_1.ReservationService])
    ], UpcomingReservationsPanelComponent);
    return UpcomingReservationsPanelComponent;
}());
exports.UpcomingReservationsPanelComponent = UpcomingReservationsPanelComponent;
//# sourceMappingURL=upcoming-reservations-panel.component.js.map