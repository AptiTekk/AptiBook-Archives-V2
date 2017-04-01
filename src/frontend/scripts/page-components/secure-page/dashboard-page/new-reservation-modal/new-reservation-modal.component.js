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
var moment = require("moment");
var router_1 = require("@angular/router");
var search_service_1 = require("../../../../services/singleton/search.service");
var modal_component_1 = require("../../../../components/modal/modal.component");
var NewReservationModalComponent = (function () {
    function NewReservationModalComponent(searchService, router) {
        this.searchService = searchService;
        this.router = router;
        this.startDate = moment();
        this.endDate = moment();
        searchService.clearResults();
    }
    Object.defineProperty(NewReservationModalComponent.prototype, "isEndBeforeStart", {
        get: function () {
            return this.endDate.isBefore(this.startDate);
        },
        enumerable: true,
        configurable: true
    });
    NewReservationModalComponent.prototype.display = function (date) {
        this.startDate = moment(date.toISOString());
        this.endDate = moment(this.startDate);
        this.modal.openModal();
    };
    NewReservationModalComponent.prototype.onSearch = function () {
        this.searchService.searchForResources(this.startDate, this.endDate);
        this.modal.closeModal();
        this.router.navigate(['', 'secure', 'search-results']);
    };
    return NewReservationModalComponent;
}());
__decorate([
    core_1.ViewChild(modal_component_1.ModalComponent),
    __metadata("design:type", modal_component_1.ModalComponent)
], NewReservationModalComponent.prototype, "modal", void 0);
NewReservationModalComponent = __decorate([
    core_1.Component({
        selector: 'new-reservation-modal',
        templateUrl: 'new-reservation-modal.component.html',
        styleUrls: ['new-reservation-modal.component.css'],
    }),
    __metadata("design:paramtypes", [search_service_1.SearchService, router_1.Router])
], NewReservationModalComponent);
exports.NewReservationModalComponent = NewReservationModalComponent;
//# sourceMappingURL=new-reservation-modal.component.js.map