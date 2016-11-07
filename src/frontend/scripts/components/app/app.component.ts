import {Component} from "@angular/core";
import {TenantService} from "../../services";

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    constructor(private tenantService: TenantService) {
    }

}