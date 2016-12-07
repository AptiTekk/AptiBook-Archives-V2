import {
    Component,
    AfterViewInit,
    ViewChild,
    Input,
    forwardRef,
    ViewEncapsulation,
    OnChanges,
    SimpleChanges
} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import moment = require("moment");
import Moment = moment.Moment;
declare const $: any;

@Component({
    selector: 'date-time-picker',
    templateUrl: 'date-time-picker.component.html',
    styleUrls: ['date-time-picker.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateTimePickerComponent),
            multi: true
        }
    ]
})
export class DateTimePickerComponent implements AfterViewInit, OnChanges, ControlValueAccessor {

    dateTimePickerBuilt: boolean = false;

    @ViewChild('container')
    container;

    @Input()
    inline: boolean = true;

    @Input()
    sideBySide: boolean = false;

    @Input()
    stacked: boolean = false;

    @Input()
    format: string = "dddd, MM/DD/YYYY, h:mm a";

    @Input()
    minDate: Moment;

    ngAfterViewInit(): void {
        this.buildDateTimePicker();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.dateTimePickerBuilt)
            return;

        let dateTimePicker = $(this.container.nativeElement);

        try {
            for (let propName in changes) {
                switch (propName) {
                    case 'minDate':
                        dateTimePicker.data("DateTimePicker").minDate(this.getMinDateToUse());
                        break;
                }
            }
        } catch (ignored) {
        }
    }

    private static removeSeconds(date): Moment {
        if (!date)
            return undefined;

        return date.seconds(0).milliseconds(0);
    }

    private getMinDateToUse() {
        return this.minDate != undefined ? DateTimePickerComponent.removeSeconds(this.minDate) : false;
    }

    private buildDateTimePicker() {
        let dateTimePicker = $(this.container.nativeElement);

        dateTimePicker.datetimepicker({
            inline: this.inline,
            sideBySide: this.stacked || this.sideBySide,
            format: this.format != undefined ? this.format : false,
            minDate: this.getMinDateToUse(),
            allowInputToggle: !this.inline
        });

        if (this.stacked) {
            dateTimePicker[0].getElementsByClassName("datepicker")[0].classList.remove("col-md-6");
            dateTimePicker[0].getElementsByClassName("datepicker")[0].classList.add("col-xs-12");

            dateTimePicker[0].getElementsByClassName("timepicker")[0].classList.remove("col-md-6");
            dateTimePicker[0].getElementsByClassName("timepicker")[0].classList.add("col-xs-12");
        }

        dateTimePicker.on("dp.change", e => {
            this.propagateChange(e.date);
        });

        this.propagateChange(DateTimePickerComponent.removeSeconds(dateTimePicker.data("DateTimePicker").date()));

        this.dateTimePickerBuilt = true;
    }

    setDate(date) {
        if (this.dateTimePickerBuilt && date != undefined)
            $(this.container.nativeElement).data("DateTimePicker").date(DateTimePickerComponent.removeSeconds(date));
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