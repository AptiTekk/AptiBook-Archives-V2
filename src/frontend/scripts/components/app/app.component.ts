import {Component} from "@angular/core";
import {TenantService} from "../../services/tenant.service";

@Component({
    selector: 'app',
    template: require('./app.component.html')
})
export class AppComponent {

    private tenant: Object;

    constructor(private tenantService: TenantService) {
        tenantService.getTenant().subscribe(
            response => this.tenant = response,
            err => this.tenant = undefined);
    }

    public getTenant() {
        return this.tenant;
    }

}