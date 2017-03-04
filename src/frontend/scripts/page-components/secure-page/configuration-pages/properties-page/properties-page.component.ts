import {Component, ViewChild} from "@angular/core";
import {APIService} from "../../../../services/singleton/api.service";
import {PropertiesService} from "../../../../services/singleton/properties-service";
import {Property} from "../../../../models/property.model";
import {ReplaySubject} from "rxjs";
import {FormGroup, FormBuilder} from "@angular/forms";
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
    stateToggle: boolean;

    constructor(private propertiesService: PropertiesService, private formBuilder: FormBuilder) {
        propertiesService.getAllProperties().subscribe(properties => {
            this.properties = properties;
            if (this.properties[2].propertyValue == 'true') {
                this.stateToggle = true;
            } else {
                this.stateToggle = false;
            }
            this.buildForm();
        });


    }

    buildForm() {
        this.formGroup = this.formBuilder.group({
            PERSONALIZATION_ORGANIZATION_NAME: [this.properties[0].propertyValue],
            REGISTRATION_ENABLED: [(this.properties[1].propertyValue == 'true')],
            GOOGLE_SIGN_IN_ENABLED: [(this.properties[2].propertyValue == 'true')],
            GOOGLE_SIGN_IN_WHITELIST: [this.properties[3].propertyValue],
            DATE_TIME_TIMEZONE: [this.properties[4].propertyValue]
        });
    }


    reset() {
        this.properties.forEach(property => {
            property.propertyValue = property.defaultValue;
            this.propertiesService.patchProperty(property).subscribe(
                response => response
            );
            console.log("value: " + property.id);
        });

    /*   for (let i = 0; i <= this.properties.length; i++) {
            this.propertiesService.patchProperty(this.properties[i]).subscribe(
                response => response
            )
        }*/
        this.buildForm();
        this.successAlert.display("Properties have been reset!");
    }

    googleToggle(state: boolean) {
        this.stateToggle = state;
    }

    onSubmit() {
        let i = 0;
        let madeChange = false;
        for (let controlName in this.formGroup.controls) {
            if (this.formGroup.controls[controlName].dirty) {
                madeChange = true;
                this.properties[i].propertyValue = this.formGroup.controls[controlName].value;
                this.propertiesService.patchProperty(this.properties[i]).subscribe(
                    response => response
                )
            }
            i++;
        }
        if (madeChange) {
            this.successAlert.display("Changes have been saved!");
        } else {
            this.warnAlert.display("No changes detected.");
        }
        madeChange = false;

    }


}