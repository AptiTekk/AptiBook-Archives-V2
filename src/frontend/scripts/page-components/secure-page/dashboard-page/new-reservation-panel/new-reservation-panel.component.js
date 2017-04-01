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
var moment = require("moment");
var router_1 = require("@angular/router");
var search_service_1 = require("../../../../services/singleton/search.service");
var NewReservationPanelComponent = (function () {
    function NewReservationPanelComponent(searchService, router) {
        this.searchService = searchService;
        this.router = router;
        this.cancelled = new core_1.EventEmitter();
        this.startDate = moment();
        this.endDate = moment();
        searchService.clearResults();
    }
    Object.defineProperty(NewReservationPanelComponent.prototype, "isEndBeforeStart", {
        get: function () {
            return this.endDate.isBefore(this.startDate);
        },
        enumerable: true,
        configurable: true
    });
    NewReservationPanelComponent.prototype.onCancel = function () {
        this.cancelled.next();
    };
    NewReservationPanelComponent.prototype.onSearch = function () {
        this.searchService.searchForResources(this.startDate, this.endDate);
        this.router.navigateByUrl("/secure/search-results");
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NewReservationPanelComponent.prototype, "cancelled", void 0);
    NewReservationPanelComponent = __decorate([
        core_1.Component({
            selector: 'new-reservation-panel',
            templateUrl: 'new-reservation-panel.component.html',
            styleUrls: ['new-reservation-panel.component.css'],
        }), 
        __metadata('design:paramtypes', [search_service_1.SearchService, router_1.Router])
    ], NewReservationPanelComponent);
    return NewReservationPanelComponent;
}());
exports.NewReservationPanelComponent = NewReservationPanelComponent;
//# sourceMappingURL=new-reservation-panel.component.js.map