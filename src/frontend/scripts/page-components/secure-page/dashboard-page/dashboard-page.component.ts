import {Component} from "@angular/core";

@Component({
    selector: 'dashboard-page',
    templateUrl: 'dashboard-page.component.html'
})
export class DashboardPageComponent {

    events = [
        {
            title: 'All Day Event',
            start: '2016-09-01',
            status: 'PENDING'
        },
        {
            title: 'Long Event',
            start: '2016-09-07',
            end: '2016-09-10',
            status: 'APPROVED'
        },
        {
            id: 999,
            title: 'Repeating Event',
            start: '2016-09-09T16:00:00',
            status: 'REJECTED'
        },
        {
            id: 999,
            title: 'Repeating Event',
            start: '2016-09-16T16:00:00',
            status: 'CANCELLED'
        },
        {
            title: 'Conference',
            start: '2016-09-11',
            end: '2016-09-13'
        },
        {
            title: 'Meeting',
            start: '2016-09-12T10:30:00',
            end: '2016-09-12T12:30:00'
        },
        {
            title: 'Lunch',
            start: '2016-09-12T12:00:00'
        },
        {
            title: 'Meeting',
            start: '2016-09-12T14:30:00'
        },
        {
            title: 'Happy Hour',
            start: '2016-09-12T17:30:00'
        },
        {
            title: 'Dinner',
            start: '2016-09-12T20:00:00'
        },
        {
            title: 'Birthday Party',
            start: '2016-09-13T07:00:00'
        },
        {
            title: 'Click for Google',
            url: 'http://google.com/',
            start: '2016-09-28'
        }
    ];

    onCalendarEventClicked(id: number) {
        alert("Clicked: "+id);
    }

}