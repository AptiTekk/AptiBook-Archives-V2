import {Component} from "@angular/core";
import {APIService} from "../../../../services/singleton/api.service";
import {PropertiesService} from "../../../../services/singleton/properties-service";
import {Property} from "../../../../models/properties.model";
import {ReplaySubject} from "rxjs";
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
    selector: 'properties-page',
    templateUrl: 'properties-page.component.html',
})
export class PropertiesPageComponent {


    //private properties: ReplaySubject<Properties[]> = new ReplaySubject(1);
    properties: Property[];
    formGroup: FormGroup;

    constructor(private propertiesService: PropertiesService, formBuilder: FormBuilder) {

        this.formGroup = formBuilder.group({
            PERSONALIZATION_ORGANIZATION_NAME: [],
            REGISTRATION_ENABLED: [],
            GOOGLE_SIGN_IN_ENABLED: [],
            GOOGLE_SIGN_IN_WHITELIST: [],
            DATE_TIME_TIMEZONE: []
        });
        propertiesService.getAllProperties().subscribe(properties => this.properties = properties);
    }

    onSubmit() {
        //TODO: Make patch methods in properties service, find what field 'dirty' from formGroup control and path values.

        if (this.formGroup.controls['PERSONALIZATION_ORGANIZATION_NAME'].dirty) {
            //its dirty so patch entity
            this.properties[0].propertyValue = this.formGroup.controls['PERSONALIZATION_ORGANIZATION_NAME'].value;
            this.propertiesService.patchProperty(this.properties[0]).subscribe(
                response => {
                    //console.log("yay it worked");
                    //TODO: Make alert and display success
                },
                err => {
                    console.log("broken");
                }
            )
        }

    }


}