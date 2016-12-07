import {Component, Input, forwardRef} from "@angular/core";
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

    on: boolean = false;

    toggle() {
        this.on = !this.on;
        this.propagateChange(this.on);
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