import {
    Component,
    Input,
    DoCheck,
    trigger,
    state,
    style,
    animate,
    transition,
    Output,
    EventEmitter
} from "@angular/core";
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
export class AlertComponent implements DoCheck {

    private oldMessage: string;

    visible: boolean = false;

    visibilityTimer: Subscription;

    @Input()
    message: string;

    @Input()
    severity: string = "info";

    @Input()
    autoClose: boolean = false;

    @Input()
    autoCloseDelay: number = 2000;

    @Output()
    onAutoClose: EventEmitter<any> = new EventEmitter();

    /**
     * Starts the autoClose timer if it is enabled
     */
    private startTimer() {
        if (this.autoClose)
            this.visibilityTimer = Observable.timer(this.autoCloseDelay).subscribe(
                i => {
                    this.visible = false;
                    this.oldMessage = undefined;
                    this.message = undefined;
                    this.onAutoClose.next();
                });
    }

    /**
     * Stops the running autoClose timer if it exists.
     */
    private stopTimer() {
        if (this.visibilityTimer != undefined) {
            this.visibilityTimer.unsubscribe();
            this.visibilityTimer = undefined;
        }
    }

    ngDoCheck(): void {
        //Check for changes
        if (this.oldMessage != this.message) {

            //It changed
            this.oldMessage = this.message;
            if (this.message != undefined) {
                this.visible = true;

                this.stopTimer();
                this.startTimer();

            } else {
                this.stopTimer();
                this.visible = false;
            }
        }
    }
}