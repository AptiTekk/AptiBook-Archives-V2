import {
    Component,
    ViewChild,
    AfterViewInit,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges
} from "@angular/core";
import {User} from "../../models/user.model";
import {Reservation} from "../../models/reservation.model";
import {ResourceCategory} from "../../models/resource-category.model";
import {UserGroup} from "../../models/user-group.model";
declare const $: any;

@Component({
    selector: 'calendar',
    templateUrl: 'calendar.component.html',
    styleUrls: ['calendar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements AfterViewInit, OnChanges {

    @ViewChild('calendarContainer')
    calendarContainer;

    @Input()
    events: [{id: number, title: string, start: any, end: any, status: string}];

    @Input()
    eventFeedUrl: string;

    @Input()
    allowSelection: boolean = true;

    @Input()
    hiddenStatuses: string[];

    @Input()
    filterByUsers: User[];

    @Input()
    filterByUserGroupOwners: UserGroup[];

    @Input()
    filterByResourceCategories: ResourceCategory[];

    @Input()
    title: string;

    @Output()
    eventSelected: EventEmitter<number> = new EventEmitter<number>();

    private calendarBuilt: boolean = false;

    constructor() {
        //Re-render and re-size calendar when window size is changed
        window.onresize = (event) => {
            this.refreshCalendar();
        };
    }

    ngAfterViewInit(): void {
        this.buildCalendar();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.calendarBuilt)
            return;

        try {
            for (let propName in changes) {
                switch (propName) {
                    case 'events':
                    case 'eventFeedUrl':
                        //Remove any existing event sources
                        $(this.calendarContainer.nativeElement).fullCalendar('removeEventSources');

                        if (this.events || this.eventFeedUrl) {
                            //Add the new event source
                            $(this.calendarContainer.nativeElement).fullCalendar('addEventSource',
                                this.getEventsToUse())
                        }
                        break;
                    case 'allowSelection':
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
        $(this.calendarContainer.nativeElement).fullCalendar({
            height: 'parent',
            header: {
                left: 'title',
                center: '',
                right: 'today month,basicWeek,listWeek,basicDay prev,next'
            },
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
                    if (this.filterByUsers && this.filterByUsers.filter(user => user.id === event.user.id).length == 0)
                        return false;

                    // Remove events not matching filtered resource categories
                    if (this.filterByResourceCategories && this.filterByResourceCategories.filter(category => category.id === event.resource.resourceCategory.id).length == 0)
                        return false;
                    //test commit

                    //test commmit2
                    // Remove events whose resources do not match the filtered user group owners
                    //TODO: Get back end method from JSF version, check against event resource owner, implement in calendar page
                   // if(event.resource.owner)
                    if(this.filterByUserGroupOwners && this.filterByUserGroupOwners.filter(owner=> owner.id === event.resource.owner.id))
                        return false;

                    if (this.filterByUserGroupOwners)
                        this.filterByUserGroupOwners.forEach(owner => console.log("Owner" + owner));

                    // If all is well, add the status to the class list.
                    let domElement: HTMLLinkElement = element[0];

                    domElement.classList.add(event.status.toLowerCase());

                    return true;
                }

                return false;
            },
            eventClick: (calEvent, jsEvent, view) => {
                if (this.allowSelection)
                    this.eventSelected.next(calEvent);
            }
        });

        if (this.title != undefined)
            this.calendarContainer.nativeElement.getElementsByClassName('fc-center')[0].innerHTML = "<h3>" + this.title + "</h3>";

        this.calendarBuilt = true;
    }

    private refreshCalendar(refreshEvents: boolean = false): void {
        if (this.calendarBuilt) {
            $(this.calendarContainer.nativeElement).fullCalendar('render');

            if (refreshEvents)
                $(this.calendarContainer.nativeElement).fullCalendar('rerenderEvents');
        }
    }
}