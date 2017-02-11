import {Component, ViewChild} from "@angular/core";
import {AlertComponent} from "../../../components/alert/alert.component";
import {RegistrationService} from "../../../services/singleton/registration.service";
import {ActivatedRoute} from "@angular/router";
@Component({
    selector: 'success-page',
    templateUrl: 'success-page.component.html'
})
export class SuccessRegisterPageComponent{
    constructor(private registrationService: RegistrationService, private activeRoute: ActivatedRoute,){

    }
/*
    @ViewChild('registerAlert')
    registerAlert: AlertComponent;*/

 /*   ngAfterViewInit(): void {
        //Check for errors in the parameters
        this.activeRoute.queryParams.subscribe(
            params => {
                if (params['registerError']) {
                    if (params['registerError'] === "user_exists")
                        this.registerAlert.display("Unfortunately, a user with this email already exists.", false);
                    else if (params['registerError'] === "null_fields")
                        this.registerAlert.display("Unfortunately, an error has occurred.", false);
                }
            });

        //Subscribe to auth messages
        this.registrationService.getRegisterMessage().subscribe(message => this.registerAlert.display(message));
    }*/
}