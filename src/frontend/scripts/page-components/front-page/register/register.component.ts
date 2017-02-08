/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent {

    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder) {

        this.formGroup = formBuilder.group({
            emailAddress: [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern("[^<>;=]*")])],
            firstName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            lastName: [null, Validators.compose([Validators.maxLength(30), Validators.pattern("[^<>;=]*")])],
            password: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
            confirmPassword: [null, Validators.compose([Validators.required, Validators.maxLength(50)])]
        });

    }

    onSubmit() {
        console.log("Submitted.");
    }

}