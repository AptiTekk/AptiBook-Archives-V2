/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, forwardRef, Input} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {noop} from "rxjs/util/noop";

@Component({
    selector: 'at-checkbox',
    templateUrl: 'checkbox.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true
        }
    ]
})
export class CheckboxComponent implements ControlValueAccessor {

    private innerValue: boolean = false;

    @Input() label: string;

    private changeListener: (value: boolean) => void = noop;

    get value(): boolean {
        return this.innerValue;
    }

    set value(value: boolean) {
        this.innerValue = value;
        this.changeListener(value);
    }

    writeValue(value: any): void {
        if (typeof value === "string")
            this.innerValue = value === "true";
        else
            this.innerValue = value;
    }

    registerOnChange(fn: any): void {
        this.changeListener = fn;
    }

    registerOnTouched(fn: any): void {
    }
}