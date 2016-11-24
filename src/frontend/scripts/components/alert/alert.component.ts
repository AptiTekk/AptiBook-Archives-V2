import {Component, Input, trigger, state, style, animate, transition, Output, EventEmitter} from "@angular/core";
import {Subscription, Observable} from "rxjs";

@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html',
    animations: [
        trigger('visibilityChanged', [
            state('true', style({opacity: 1, transform: 'translateY(0%)'})),
            state('false', style({opacity: 0, transform: 'translateY(-100%)', margin: 0, padding: '0 15px'})),
            transition('1 => 0', animate('200ms')),
            transition('0 => 1', animate('200ms'))
        ])
    ]
})
export class AlertComponent {

    timerRunning: boolean = false;

    visibilityTimer: Subscription;

    @Input()
    displayed: boolean = false;

    @Input()
    message: string;

    @Input()
    severity: string = "info";

    @Input()
    autoCloseDelay: number = 2000;

    @Output()
    onAutoClose: EventEmitter<any> = new EventEmitter();

    /**
     * Starts the autoClose timer if it is enabled
     */
    private startTimer() {
        this.timerRunning = true;
        this.visibilityTimer = Observable.timer(this.autoCloseDelay).subscribe(
            i => {
                this.onAutoClose.next();
                this.stopTimer();
            });
    }

    /**
     * Stops the running autoClose timer if it exists.
     */
    private stopTimer() {
        this.timerRunning = false;
        if (this.visibilityTimer != undefined) {
            this.visibilityTimer.unsubscribe();
            this.visibilityTimer = undefined;
        }
    }

    display(message?: string, autoClose: boolean = true) {
        if (message != undefined)
        {
            this.message = message;
            if (autoClose) {
                this.displayed = false;
                this.stopTimer();
                this.startTimer();
            } else {
                this.displayed = true;
            }
        }
    }

}