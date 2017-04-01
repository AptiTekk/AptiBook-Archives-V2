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
var api_service_1 = require("../../services/singleton/api.service");
var CalendarComponent = CalendarComponent_1 = (function () {
    function CalendarComponent(apiService) {
        this.apiService = apiService;
        this.allowEventSelection = true;
        this.allowDaySelection = false;
        this.eventSelected = new core_1.EventEmitter();
        this.daySelected = new core_1.EventEmitter();
    }
    CalendarComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Re-render and re-size calendar when window size is changed
        window.onresize = function () { return _this.refreshCalendar(); };
    };
    CalendarComponent.prototype.ngAfterViewInit = function () {
        this.buildCalendar();
    };
    CalendarComponent.prototype.ngOnChanges = function (changes) {
        if (!this.calendar)
            return;
        try {
            for (var propName in changes) {
                switch (propName) {
                    case 'events':
                    case 'eventFeedEndpoint':
                        //Remove any existing event sources
                        this.calendar.fullCalendar('removeEventSources');
                        if (this.events || this.eventFeedEndpoint) {
                            //Add the new event source
                            this.calendar.fullCalendar('addEventSource', this.getEventsToUse());
                        }
                        break;
                    case 'allowEventSelection':
                    case 'allowDaySelection':
                    case 'title':
                    case 'hiddenStatuses':
                    case 'filterByUsers':
                    case 'filterByResourceCategories':
                    case 'filterByUserGroupOwners':
                        this.refreshCalendar(true);
                        break;
                    case 'view':
                        this.setView(this.view);
                        this.refreshCalendar(true);
                        break;
                }
            }
        }
        catch (ignored) {
        }
    };
    CalendarComponent.prototype.getEventsToUse = function () {
        var _this = this;
        if (this.events)
            return this.events;
        if (this.eventFeedEndpoint)
            return function (start, end, timezone, callback) {
                _this.apiService
                    .get(_this.eventFeedEndpoint + "?start=" + start.toISOString() + "&end=" + end.toISOString())
                    .subscribe(function (events) { return callback(events); });
            };
    };
    CalendarComponent.prototype.buildCalendar = function () {
        var _this = this;
        var calendar = $(this.calendarContainer.nativeElement);
        calendar.fullCalendar({
            height: 'parent',
            header: false,
            fixedWeekCount: false,
            editable: false,
            eventLimit: true,
            events: this.getEventsToUse(),
            timezone: 'local',
            view: this.view ? this.view : CalendarComponent_1.VIEW_CALENDAR,
            eventRender: function (event, element) {
                if (event.status) {
                    // Remove events matching hidden statuses
                    if (_this.hiddenStatuses && _this.hiddenStatuses.map(function (string) { return string.toLowerCase(); }).includes(event.status.toLowerCase()))
                        return false;
                    // Remove events not matching filtered users
                    if (_this.filterByUsers && _this.filterByUsers.filter(function (user) { return user.id === event.user.id; }).length === 0)
                        return false;
                    // Remove events not matching filtered resource categories
                    if (_this.filterByResourceCategories && _this.filterByResourceCategories.filter(function (category) { return category.id === event.resource.resourceCategory.id; }).length === 0)
                        return false;
                    // Remove events whose resources do not match the filtered user group owners
                    if (_this.filterByUserGroupOwners && _this.filterByUserGroupOwners.filter(function (owner) { return owner.id === event.resource.owner.id; }).length === 0)
                        return false;
                    // If all is well, add the status to the class list.
                    var domElement = element[0];
                    domElement.classList.add(event.status.toLowerCase());
                    return true;
                }
                return false;
            },
            eventClick: function (calEvent, jsEvent, view) {
                if (_this.allowEventSelection)
                    _this.eventSelected.next(calEvent);
            },
            dayClick: function (date, jsEvent, view) {
                if (_this.allowDaySelection)
                    _this.daySelected.next(date);
            }
        });
        this.calendar = calendar;
    };
    /**
     * Gets the title of the calendar for the header.
     * @returns The title as a string, or an empty string if one is not defined.
     */
    CalendarComponent.prototype.getTitle = function () {
        if (this.title)
            return this.title;
        if (this.calendar) {
            var view = this.calendar.fullCalendar('getView');
            if (view)
                return view.title;
        }
        return '';
    };
    CalendarComponent.prototype.goPrevious = function () {
        if (this.calendar)
            this.calendar.fullCalendar('prev');
    };
    CalendarComponent.prototype.goNext = function () {
        if (this.calendar)
            this.calendar.fullCalendar('next');
    };
    CalendarComponent.prototype.setView = function (view) {
        if (this.calendar)
            this.calendar.fullCalendar('changeView', view ? view : CalendarComponent_1.VIEW_CALENDAR);
    };
    CalendarComponent.prototype.refreshCalendar = function (refreshEvents) {
        if (refreshEvents === void 0) { refreshEvents = false; }
        if (this.calendar) {
            this.calendar.fullCalendar('render');
            if (refreshEvents)
                this.calendar.fullCalendar('rerenderEvents');
        }
    };
    return CalendarComponent;
}());
CalendarComponent.VIEW_CALENDAR = "month";
CalendarComponent.VIEW_WEEK = "basicWeek";
CalendarComponent.VIEW_DAY = "basicDay";
CalendarComponent.VIEW_AGENDA_WEEK = "agendaWeek";
CalendarComponent.VIEW_AGENDA_DAY = "agendaDay";
CalendarComponent.VIEW_LIST_MONTH = "listMonth";
CalendarComponent.VIEW_LIST_WEEK = "listWeek";
__decorate([
    core_1.ViewChild('calendarContainer'),
    __metadata("design:type", Object)
], CalendarComponent.prototype, "calendarContainer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CalendarComponent.prototype, "events", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CalendarComponent.prototype, "eventFeedEndpoint", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], CalendarComponent.prototype, "allowEventSelection", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], CalendarComponent.prototype, "allowDaySelection", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CalendarComponent.prototype, "hiddenStatuses", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CalendarComponent.prototype, "filterByUsers", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CalendarComponent.prototype, "filterByUserGroupOwners", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CalendarComponent.prototype, "filterByResourceCategories", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CalendarComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CalendarComponent.prototype, "view", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], CalendarComponent.prototype, "eventSelected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], CalendarComponent.prototype, "daySelected", void 0);
CalendarComponent = CalendarComponent_1 = __decorate([
    core_1.Component({
        selector: 'calendar',
        templateUrl: 'calendar.component.html',
        styleUrls: ['calendar.component.css']
    }),
    __metadata("design:paramtypes", [api_service_1.APIService])
], CalendarComponent);
exports.CalendarComponent = CalendarComponent;
var CalendarComponent_1;
//# sourceMappingURL=calendar.component.js.map