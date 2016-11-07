import {Component} from "@angular/core";
import {TenantService} from "../../services/tenant.service";

require('./front-page.component.css');
@Component({
    selector: 'front-page',
    template: require('./front-page.component.html'),
})
export class FrontPageComponent {

    private tenantSlug: string;

    constructor(tenantService: TenantService) {
        tenantService.getTenant().subscribe(response => this.tenantSlug = response.slug);
    }

}