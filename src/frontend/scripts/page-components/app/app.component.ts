import {Component, ViewEncapsulation} from "@angular/core";
import Moment = moment.Moment;
import moment = require("moment");

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    constructor(){
        moment.locale('en', {
            calendar : {
                lastDay : '[Yesterday at] LT',
                sameDay : '[Today at] LT',
                nextDay : '[Tomorrow at] LT',
                lastWeek : '[last] dddd [at] LT',
                nextWeek : 'dddd [at] LT',
                sameElse : 'L [at] LT'
            }
        });
    }
}