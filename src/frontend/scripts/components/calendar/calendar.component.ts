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
    title: string;

    @Output()
    eventSelected: EventEmitter<number> = new EventEmitter<number>();

    private calendarBuilt: boolean = false;

    constructor() {
        //Re-render and re-size calendar when window size is changed
        window.onresize = (event) => {
            if (this.calendarBuilt) {
                $(this.calendarContainer.nativeElement).fullCalendar('render');
            }
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

                        if (this.events != undefined || this.eventFeedUrl != undefined) {
                            //Add the new event source
                            $(this.calendarContainer.nativeElement).fullCalendar('addEventSource',
                                this.getEventsToUse())
                        }
                        break;
                }
            }
        } catch (ignored) {
        }
    }

    private getEventsToUse(): any {
        return this.events != undefined ? this.events : this.eventFeedUrl != undefined ? this.eventFeedUrl : [];
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

            eventRender: (event, element) => {
                if (event.status != undefined) {
                    if (this.hiddenStatuses != undefined && this.hiddenStatuses.map(string => string.toLowerCase()).includes(event.status.toLowerCase()))
                        return false;
                    else
                        element[0].classList.add(event.status.toLowerCase());
                }
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
}