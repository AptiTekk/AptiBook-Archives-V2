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
    timezone: string = 'UTC';

    @Output()
    eventSelected: EventEmitter<number> = new EventEmitter<number>();

    ngAfterViewInit(): void {
        this.buildCalendar();
    }

    ngOnChanges(changes: SimpleChanges): void {
        $(this.calendarContainer.nativeElement).fullCalendar('option', 'timezone', this.timezone != undefined ? this.timezone : false);
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
            events: this.events != undefined ? this.events : this.eventFeedUrl != undefined ? this.eventFeedUrl : [],
            timezone: this.timezone,

            eventRender: (event, element) => {
                if (this.allowSelection)
                    element[0].classList.add("fc-event-selectable");

                if (event.status != undefined) {
                    if (this.hiddenStatuses != undefined && this.hiddenStatuses.map(string => string.toLowerCase()).includes(event.status.toLowerCase()))
                        return false;
                    else
                        element[0].classList.add(event.status.toLowerCase());
                }
            },
            eventClick: (calEvent, jsEvent, view) => {
                if (this.allowSelection)
                    this.eventSelected.next(calEvent.id);
            }
        });
    }
}