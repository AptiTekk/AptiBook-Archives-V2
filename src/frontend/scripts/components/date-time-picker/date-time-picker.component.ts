import {Component, AfterViewInit, ViewChild, Input, forwardRef, ViewEncapsulation} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
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
export class DateTimePickerComponent implements AfterViewInit, ControlValueAccessor {

    dateTimePickerBuilt: boolean = false;

    @ViewChild('container')
    container;

    @Input()
    inline: boolean = true;

    @Input()
    sideBySide: boolean = false;

    @Input()
    format: string = "MM/dd/YYYY h:mm a";

    ngAfterViewInit(): void {
        this.buildDateTimePicker();
    }

    private buildDateTimePicker() {
        let dateTimePicker = $(this.container.nativeElement);

        dateTimePicker.datetimepicker({
            inline: this.inline,
            sideBySide: this.sideBySide,
            format: this.format != undefined ? this.format : false
        });

        dateTimePicker.on("dp.change", e => {
            this.propagateChange(e.date);
        });

        this.propagateChange(dateTimePicker.data("DateTimePicker").date());

        this.dateTimePickerBuilt = true;
    }

    setDate(date) {
        if (this.dateTimePickerBuilt && date != undefined)
            $(this.container.nativeElement).data("DateTimePicker").date(date);
    }

    propagateChange = (_: any) => {
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