/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, ViewChild} from "@angular/core";
import {PropertiesService} from "../../../../services/singleton/properties-service";
import {Property} from "../../../../models/property.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AlertComponent} from "../../../../components/alert/alert.component";

@Component({
    selector: 'properties-page',
    templateUrl: 'properties-page.component.html',
})
export class PropertiesPageComponent {

    @ViewChild('successAlert')
    successAlert: AlertComponent;

    @ViewChild('warnAlert')
    warnAlert: AlertComponent;

    public properties: Property[];
    formGroup: FormGroup;

    constructor(private propertiesService: PropertiesService, private formBuilder: FormBuilder) {
        propertiesService.getAllProperties().subscribe(properties => {
            this.properties = properties;
            this.buildForm();
        });
    }

    buildForm() {
        this.formGroup = this.formBuilder.group(
            // This will turn the array of properties into an object with keys named by the property key names, and values of the properties' values.
            this.properties.reduce((map, property) => {
                map[property.keyName] = property.propertyValue;
                return map;
            })
        );
    }


    reset() {
        this.properties.forEach(property => {
            property.propertyValue = property.defaultValue;
            this.propertiesService.patchProperty(property).subscribe(
                response => response
            );
        });

        this.buildForm();
        this.successAlert.display("Properties have been reset!");
    }

    onSubmit() {
        let madeChange = false;
        for (let controlName in this.formGroup.controls) {
            if (this.formGroup.controls[controlName].dirty) {
                madeChange = true;

                let propertyPatch: Property = {
                    propertyValue: this.formGroup.controls[controlName].value,
                    keyName: controlName
                };

                this.propertiesService.patchProperty(propertyPatch).subscribe(
                    response => response
                )
            }
        }
        if (madeChange) {
            this.successAlert.display("Changes have been saved!");
        } else {
            this.warnAlert.display("No changes detected.");
        }
        madeChange = false;

    }


}