import {Component, ViewChild} from "@angular/core";
import {APIService} from "../../../../services/singleton/api.service";
import {PropertiesService} from "../../../../services/singleton/properties-service";
import {Property} from "../../../../models/properties.model";
import {ReplaySubject} from "rxjs";
import {FormGroup, FormBuilder} from "@angular/forms";
import {AlertComponent} from "../../../../components/alert/alert.component";

@Component({
    selector: 'properties-page',
    templateUrl: 'properties-page.component.html',
})
export class PropertiesPageComponent {


    @ViewChild('changeAlert')
    changeAlert: AlertComponent;

    public properties: Property[];
    formGroup: FormGroup;

    constructor(private propertiesService: PropertiesService, formBuilder: FormBuilder) {
        propertiesService.getAllProperties().subscribe(properties => {
            this.properties = properties;
            this.formGroup = formBuilder.group({
                PERSONALIZATION_ORGANIZATION_NAME: [this.properties[0].propertyValue],
                REGISTRATION_ENABLED: [(this.properties[1].propertyValue == 'true')],
                GOOGLE_SIGN_IN_ENABLED: [(this.properties[2].propertyValue == 'true')],
                GOOGLE_SIGN_IN_WHITELIST: [this.properties[3].propertyValue],
                DATE_TIME_TIMEZONE: [this.properties[4].propertyValue]
            });


        });

    }

    onSubmit() {
        let i = 0;
        for(let controlName in this.formGroup.controls)
        {
            if (this.formGroup.controls[controlName].dirty) {
                this.properties[i].propertyValue = this.formGroup.controls[controlName].value;
                this.propertiesService.patchProperty(this.properties[i]).subscribe(
                    response => {
                        this.changeAlert.display("Changes have been saved.");
                    },
                    err => {
                        console.log("broken");
                    }
                )
            }
            i++;
        }



    }


}