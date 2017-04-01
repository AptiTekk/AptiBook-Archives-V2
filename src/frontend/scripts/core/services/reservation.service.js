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
var api_service_1 = require("./api.service");
var rxjs_1 = require("rxjs");
var moment = require("moment");
var auth_service_1 = require("./auth.service");
var ReservationService = (function () {
    function ReservationService(apiService, authService) {
        this.apiService = apiService;
        this.authService = authService;
        this.lastReservationMade = new rxjs_1.ReplaySubject(1);
    }
    ReservationService.prototype.getUpcomingUserReservations = function (user) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            if (user == undefined)
                listener.next(undefined);
            else
                _this.apiService.get("reservations/user/" + user.id + "?start=" + moment().utc().format("YYYY-MM-DDTHH:mm:ss")).subscribe(function (response) { return listener.next(response); }, function (err) { return listener.next(undefined); });
        });
    };
    ReservationService.prototype.makeReservationDecision = function (approved, reservation) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.patch("reservations/" + reservation.id + (approved ? "/approved" : "/rejected")).subscribe(function (response) { return listener.next(true); }, function (err) { return listener.next(false); });
        });
    };
    ReservationService.prototype.makeReservation = function (reservation) {
        var _this = this;
        return rxjs_1.Observable.create(function (listener) {
            _this.apiService.post("reservations/user/" + reservation.user.id, reservation).subscribe(function (response) {
                var reservation = response;
                listener.next(reservation);
                _this.lastReservationMade.next(reservation);
            }, function (err) { return listener.next(undefined); });
        });
    };
    ReservationService.prototype.getLastReservationMade = function () {
        return this.lastReservationMade;
    };
    return ReservationService;
}());
ReservationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService,
        auth_service_1.AuthService])
], ReservationService);
exports.ReservationService = ReservationService;
//# sourceMappingURL=reservation.service.js.map