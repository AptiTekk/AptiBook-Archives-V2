/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'form-group',
    templateUrl: 'form-group.component.html'
})
export class FormGroupComponent {

    /**
     * The FormGroup (Reactive Forms)
     */
    @Input()
    group: FormGroup;

    /**
     * The Name of the Control in the FormGroup
     */
    @Input()
    controlName: string;

    /**
     * Object containing the Error Messages to be shown when input is invalid.
     */
    @Input()
    errorMessages: {[errorName: string]: string};

    /**
     * Label Text
     */
    @Input()
    label: string;

    /**
     * Type of Input
     */
    @Input()
    inputType: string;

    @Input()
    autoFocus: boolean = false;

    /**
     * Font Awesome Icon Name
     */
    @Input()
    faIconName: string;

    getErrorMessage(): string {

        if (this.errorMessages && this.group && this.controlName) {
            let errors: {[key: string]: any} = this.group.controls[this.controlName].errors;
            if (errors) {
                for (let errorName in this.errorMessages) {
                    if (this.errorMessages.hasOwnProperty(errorName)) {
                        if (errorName in errors)
                            return this.errorMessages[errorName];
                    }
                }
            }
        }

        return undefined;
    }

}