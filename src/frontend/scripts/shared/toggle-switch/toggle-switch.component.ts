/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {AfterViewInit, Component, EventEmitter, forwardRef, Input, Output} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

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
export class ToggleSwitchComponent implements AfterViewInit, ControlValueAccessor {

    @Input() onText: string = "On";
    @Input() offText: string = "Off";

    switchWidth: number = 0;

    @Output()
    onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

    on: boolean;

    ngAfterViewInit(): void {
        this.calculateSwitchWidth();
    }

    private calculateSwitchWidth() {
        let maxLabelLength = this.onText.length;

        if (this.offText.length > maxLabelLength)
            maxLabelLength = this.offText.length;

        this.switchWidth = (maxLabelLength * 13);
    }

    toggle() {
        this.on = !this.on;
        this.propagateChange(this.on);
        this.onToggle.next(this.on);
    }

    public isOn(): boolean {
        return this.on;
    }

    writeValue(obj: any): void {

        // Allows for strings to be passed in as values.
        if (typeof obj === "string")
            this.on = obj == "true";
        else
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