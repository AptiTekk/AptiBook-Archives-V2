import {Component, Input, forwardRef, Output, EventEmitter} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";

@Component({
    selector: 'toggle-switch',
    templateUrl: 'toggle-switch.component.html',
    styleUrls: ['toggle-switch.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleSwitchComponent),
            multi: true
        }
    ]
})
export class ToggleSwitchComponent implements ControlValueAccessor {

    @Input()
    onText: string = "On";
    @Input()
    offText: string = "Off";

    @Output()
    onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

    on: boolean = false;

    toggle() {
        this.on = !this.on;
        this.propagateChange(this.on);
        this.onToggle.next(this.on);
    }

    writeValue(obj: any): void {
        this.on = obj;
    }

    propagateChange = (value: boolean) => {
    };

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

}