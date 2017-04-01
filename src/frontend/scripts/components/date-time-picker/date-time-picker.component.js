/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var DateTimePickerComponent = DateTimePickerComponent_1 = (function () {
    function DateTimePickerComponent() {
        this.dateTimePickerBuilt = false;
        this.inline = true;
        this.sideBySide = false;
        this.stacked = false;
        this.format = "dddd, MM/DD/YYYY, h:mm a";
        this.propagateChange = function (value) {
        };
    }
    DateTimePickerComponent.prototype.ngAfterViewInit = function () {
        this.buildDateTimePicker();
    };
    DateTimePickerComponent.prototype.ngOnChanges = function (changes) {
        if (!this.dateTimePickerBuilt)
            return;
        try {
            for (var propName in changes) {
                switch (propName) {
                    case 'minDate':
                        this.dateTimePicker.data("DateTimePicker").minDate(this.getMinDateToUse());
                        this.ensureDateIsAfterMinDate();
                        break;
                }
            }
        }
        catch (ignored) {
        }
    };
    /**
     * Clones and removes (sets to 0) the time of the provided moment, and returns the result as a new moment.
     * @param date The moment to reference.
     * @param onlySeconds If only the seconds (and milliseconds) should be removed. Otherwise, minutes and hours will also be removed.
     * @returns The new moment, or undefined if the date was undefined.
     */
    DateTimePickerComponent.removeTime = function (date, onlySeconds) {
        if (onlySeconds === void 0) { onlySeconds = false; }
        if (!date)
            return undefined;
        return date.clone().startOf(onlySeconds ? 'minute' : 'day');
    };
    /**
     * Determines what should be set to the 'minDate' key of the DateTimePicker options.
     * @returns {Moment|boolean}
     */
    DateTimePickerComponent.prototype.getMinDateToUse = function () {
        return this.minDate ? DateTimePickerComponent_1.removeTime(this.minDate) : false;
    };
    /**
     * Builds the dateTimePicker using the options provided.
     */
    DateTimePickerComponent.prototype.buildDateTimePicker = function () {
        var _this = this;
        this.dateTimePicker = $(this.container.nativeElement);
        this.dateTimePicker.datetimepicker({
            inline: this.inline,
            sideBySide: this.stacked || this.sideBySide,
            format: this.format ? this.format : false,
            minDate: this.getMinDateToUse(),
            allowInputToggle: !this.inline
        });
        if (this.stacked) {
            this.dateTimePicker[0].getElementsByClassName("datepicker")[0].classList.remove("col-md-6");
            this.dateTimePicker[0].getElementsByClassName("datepicker")[0].classList.add("col-xs-12");
            this.dateTimePicker[0].getElementsByClassName("timepicker")[0].classList.remove("col-md-6");
            this.dateTimePicker[0].getElementsByClassName("timepicker")[0].classList.add("col-xs-12");
        }
        this.dateTimePicker.on("dp.change", function (e) {
            var newDate = e.date;
            if (_this.ensureDateIsAfterMinDate())
                _this.propagateChange(newDate);
        });
        this.ensureDateIsAfterMinDate();
        this.dateTimePickerBuilt = true;
    };
    /**
     * Ensures that the current date is after the minDate (by at least 1 minute).
     * If not, then it will be reset to 1 minute after the minDate.
     *
     * @returns true if the date was after the minDate, false if it was reset.
     */
    DateTimePickerComponent.prototype.ensureDateIsAfterMinDate = function () {
        var currentDate = this.dateTimePicker.data("DateTimePicker").date();
        if (this.minDate && currentDate) {
            if (!currentDate.isAfter(this.minDate)) {
                currentDate = DateTimePickerComponent_1.removeTime(this.minDate, true).add(1, 'minute');
                this.setDate(currentDate);
                return false;
            }
        }
        return true;
    };
    /**
     * Sets the date of the picker.
     * @param date The new date
     */
    DateTimePickerComponent.prototype.setDate = function (date) {
        if (this.dateTimePickerBuilt && date) {
            this.dateTimePicker.data("DateTimePicker").date(DateTimePickerComponent_1.removeTime(date, true));
        }
    };
    DateTimePickerComponent.prototype.writeValue = function (obj) {
        this.setDate(obj);
    };
    DateTimePickerComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    DateTimePickerComponent.prototype.registerOnTouched = function (fn) {
    };
    return DateTimePickerComponent;
}());
__decorate([
    core_1.ViewChild('container'),
    __metadata("design:type", core_1.ElementRef)
], DateTimePickerComponent.prototype, "container", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "inline", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "sideBySide", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "stacked", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "format", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DateTimePickerComponent.prototype, "minDate", void 0);
DateTimePickerComponent = DateTimePickerComponent_1 = __decorate([
    core_1.Component({
        selector: 'date-time-picker',
        templateUrl: 'date-time-picker.component.html',
        styleUrls: ['date-time-picker.component.css'],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return DateTimePickerComponent_1; }),
                multi: true
            }
        ]
    })
], DateTimePickerComponent);
exports.DateTimePickerComponent = DateTimePickerComponent;
var DateTimePickerComponent_1;
//# sourceMappingURL=date-time-picker.component.js.map