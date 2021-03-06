/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import moment = require("moment");
import Moment = moment.Moment;

@Component({
    selector: 'date-time-picker',
    templateUrl: 'date-time-picker.component.html',
    styleUrls: ['date-time-picker.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateTimePickerComponent),
            multi: true
        }
    ]
})
export class DateTimePickerComponent implements AfterViewInit, OnChanges, ControlValueAccessor {

    private dateTimePickerBuilt: boolean = false;

    @ViewChild('container') private container: ElementRef;

    @Input() inline: boolean = true;

    @Input() sideBySide: boolean = false;

    @Input() stacked: boolean = false;

    @Input() format: string = "dddd, MM/DD/YYYY, h:mm a";

    @Input() minDate: Moment;

    private dateTimePicker: JQuery;

    ngAfterViewInit(): void {
        this.buildDateTimePicker();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.dateTimePickerBuilt)
            return;

        try {
            for (let propName in changes) {
                switch (propName) {
                    case 'minDate':
                        this.dateTimePicker.data("DateTimePicker").minDate(this.getMinDateToUse());
                        this.ensureDateIsAfterMinDate();
                        break;
                }
            }
        } catch (ignored) {
        }
    }

    /**
     * Clones and removes (sets to 0) the time of the provided moment, and returns the result as a new moment.
     * @param date The moment to reference.
     * @param onlySeconds If only the seconds (and milliseconds) should be removed. Otherwise, minutes and hours will also be removed.
     * @returns The new moment, or undefined if the date was undefined.
     */
    private static removeTime(date: Moment, onlySeconds: boolean = false): Moment {
        if (!date)
            return undefined;

        return date.clone().startOf(onlySeconds ? 'minute' : 'day');
    }

    /**
     * Determines what should be set to the 'minDate' key of the DateTimePicker options.
     * @returns {Moment|boolean}
     */
    private getMinDateToUse() {
        return this.minDate ? DateTimePickerComponent.removeTime(this.minDate) : false;
    }

    /**
     * Builds the dateTimePicker using the options provided.
     */
    private buildDateTimePicker() {
        this.dateTimePicker = $(this.container.nativeElement);

        this.dateTimePicker.datetimepicker({
            inline: this.inline,
            sideBySide: this.stacked || this.sideBySide,
            format: this.format ? this.format : false,
            minDate: this.getMinDateToUse(),
            allowInputToggle: !this.inline,
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
        });

        if (this.stacked) {
            this.dateTimePicker[0].getElementsByClassName("datepicker")[0].classList.remove("col-md-6");
            this.dateTimePicker[0].getElementsByClassName("datepicker")[0].classList.add("col-12");

            this.dateTimePicker[0].getElementsByClassName("timepicker")[0].classList.remove("col-md-6");
            this.dateTimePicker[0].getElementsByClassName("timepicker")[0].classList.add("col-12");
        }

        this.dateTimePicker.on("dp.change", (e: any) => {
            let newDate: Moment = e.date;

            if (this.ensureDateIsAfterMinDate())
                this.propagateChange(newDate);
        });

        this.ensureDateIsAfterMinDate();

        this.dateTimePickerBuilt = true;
    }

    /**
     * Ensures that the current date is after the minDate (by at least 1 minute).
     * If not, then it will be reset to 1 minute after the minDate.
     *
     * @returns true if the date was after the minDate, false if it was reset.
     */
    private ensureDateIsAfterMinDate(): boolean {
        let currentDate: Moment = this.dateTimePicker.data("DateTimePicker").date();

        if (this.minDate && currentDate) {
            if (!currentDate.isAfter(this.minDate)) {
                currentDate = DateTimePickerComponent.removeTime(this.minDate, true).add(1, 'minute');
                this.setDate(currentDate);
                return false;
            }
        }

        return true;
    }

    /**
     * Sets the date of the picker.
     * @param date The new date
     */
    public setDate(date) {
        if (this.dateTimePickerBuilt && date) {
            this.dateTimePicker.data("DateTimePicker").date(DateTimePickerComponent.removeTime(date, true));
        }
    }

    propagateChange = (value: Moment) => {
    };

    writeValue(obj: any): void {
        this.setDate(obj);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

}