import {
    Component,
    ViewChild,
    AfterViewInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    OnInit
} from "@angular/core";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import {ResourceCategory} from "../../models/resource-category.model";
import {UserGroup} from "../../models/user-group.model";
import Moment = moment.Moment;
import moment = require("moment");

@Component({
    selector: 'calendar',
    templateUrl: 'calendar.component.html',
    styleUrls: ['calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnChanges {

    @ViewChild('calendarContainer')
    calendarContainer;

    @Input() events: [{ id: number, title: string, start: any, end: any, status: string }];

    @Input() eventFeedUrl: string;

    @Input() allowEventSelection: boolean = true;

    @Input() allowDaySelection: boolean = false;

    @Input() hiddenStatuses: string[];

    @Input() filterByUsers: User[];

    @Input() filterByUserGroupOwners: UserGroup[];

    @Input() filterByResourceCategories: ResourceCategory[];

    @Input() title: string;

    @Output() eventSelected: EventEmitter<any> = new EventEmitter<any>();

    @Output() daySelected: EventEmitter<Moment> = new EventEmitter<Moment>();

    private calendar: any;

    ngOnInit(): void {
        //Re-render and re-size calendar when window size is changed
        window.onresize = (event) => {
            this.refreshCalendar();
        };
    }

    ngAfterViewInit(): void {
        this.buildCalendar();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.calendar)
            return;

        try {
            for (let propName in changes) {
                switch (propName) {
                    case 'events':
                    case 'eventFeedUrl':
                        //Remove any existing event sources
                        this.calendar.fullCalendar('removeEventSources');

                        if (this.events || this.eventFeedUrl) {
                            //Add the new event source
                            this.calendar.fullCalendar('addEventSource',
                                this.getEventsToUse())
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
                }
            }
        } catch (ignored) {
        }
    }

    private getEventsToUse(): any {
        return this.events ? this.events : this.eventFeedUrl ? this.eventFeedUrl : [];
    }

    private buildCalendar(): void {
        let calendar: any = $(this.calendarContainer.nativeElement);
        calendar.fullCalendar({
            height: 'parent',
            header: false,
            fixedWeekCount: false,
            editable: false, //Drag and drop
            eventLimit: true, //"More" link below too many events on a day
            events: this.getEventsToUse(),
            timezone: 'local',

            eventRender: (event: Reservation, element) => {
                if (event.status) {

                    // Remove events matching hidden statuses
                    if (this.hiddenStatuses && this.hiddenStatuses.map(string => string.toLowerCase()).includes(event.status.toLowerCase()))
                        return false;

                    // Remove events not matching filtered users
                    if (this.filterByUsers && this.filterByUsers.filter(user => user.id === event.user.id).length === 0)
                        return false;

                    // Remove events not matching filtered resource categories
                    if (this.filterByResourceCategories && this.filterByResourceCategories.filter(category => category.id === event.resource.resourceCategory.id).length === 0)
                        return false;

                    // Remove events whose resources do not match the filtered user group owners
                    if (this.filterByUserGroupOwners && this.filterByUserGroupOwners.filter(owner => owner.id === event.resource.owner.id).length === 0)
                        return false;

                    // If all is well, add the status to the class list.
                    let domElement: HTMLLinkElement = element[0];

                    domElement.classList.add(event.status.toLowerCase());

                    return true;
                }

                return false;
            },
            eventClick: (calEvent, jsEvent, view) => {
                if (this.allowEventSelection)
                    this.eventSelected.next(calEvent);
            },
            dayClick: (date, jsEvent, view) => {
                if (this.allowDaySelection)
                    this.daySelected.next(date);
            }
        });

        this.calendar = calendar;
    }

    /**
     * Gets the title of the calendar for the header.
     * @returns The title as a string, or an empty string if one is not defined.
     */
    private getTitle(): string {
        if (this.title)
            return this.title;

        if (this.calendar) {
            let view = this.calendar.fullCalendar('getView');
            if (view)
                return view.title;
        }

        return '';
    }

    private onPrev() {
        if (this.calendar)
            this.calendar.fullCalendar('prev');
    }

    private onNext() {
        if (this.calendar)
            this.calendar.fullCalendar('next');
    }

    private refreshCalendar(refreshEvents: boolean = false): void {
        if (this.calendar) {
            this.calendar.fullCalendar('render');

            if (refreshEvents)
                this.calendar.fullCalendar('rerenderEvents');
        }
    }
}