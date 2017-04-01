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
var reservation_details_service_1 = require("../../../../services/singleton/reservation-details.service");
var search_service_1 = require("../../../../services/singleton/search.service");
var auth_service_1 = require("../../../../services/singleton/auth.service");
var reservation_service_1 = require("../../../../services/singleton/reservation.service");
var router_1 = require("@angular/router");
var api_service_1 = require("../../../../services/singleton/api.service");
var forms_1 = require("@angular/forms");
var ReservationDetailsComponent = (function () {
    function ReservationDetailsComponent(apiService, formBuilder, reservationDetailsService, searchService, authService, reservationService, router) {
        var _this = this;
        this.apiService = apiService;
        this.formBuilder = formBuilder;
        this.reservationDetailsService = reservationDetailsService;
        this.searchService = searchService;
        this.authService = authService;
        this.reservationService = reservationService;
        this.router = router;
        this.formGroup = formBuilder.group({
            title: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(100), forms_1.Validators.pattern("[^<>;=]*")])]
        });
        authService.getUser().subscribe(function (user) {
            if (user != undefined) {
                _this.user = user;
            }
        });
        this.resource = reservationDetailsService.getResource();
        searchService.getStartTime().subscribe(function (start) { return _this.start = start; });
        searchService.getEndTime().subscribe(function (end) { return _this.end = end; });
    }
    ReservationDetailsComponent.prototype.reserve = function () {
        var _this = this;
        var reservation = {};
        reservation.user = { id: this.user.id };
        reservation.title = this.formGroup.controls['title'].value;
        reservation.start = this.start.toISOString();
        reservation.end = this.end.toISOString();
        reservation.resource = { id: this.resource.id };
        this.reservationService.makeReservation(reservation).subscribe(function (newReservation) {
            if (newReservation) {
                _this.router.navigate(['', 'secure', 'search-results', 'success']);
            }
        });
    };
    return ReservationDetailsComponent;
}());
ReservationDetailsComponent = __decorate([
    core_1.Component({
        selector: 'reservation-details-page',
        templateUrl: 'reservation-details-page.component.html',
        styleUrls: ['reservation-details-page.component.css']
    }),
    __metadata("design:paramtypes", [api_service_1.APIService,
        forms_1.FormBuilder,
        reservation_details_service_1.ReservationDetailsService,
        search_service_1.SearchService,
        auth_service_1.AuthService,
        reservation_service_1.ReservationService,
        router_1.Router])
], ReservationDetailsComponent);
exports.ReservationDetailsComponent = ReservationDetailsComponent;
//# sourceMappingURL=reservation-details-page.component.js.map