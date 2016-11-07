import {Component} from "@angular/core";
import {TenantService} from "../../services/tenant.service";

@Component({
    selector: 'app',
    template: require('./app.component.html')
})
export class AppComponent {

    constructor(private tenantService: TenantService) {
    }

}