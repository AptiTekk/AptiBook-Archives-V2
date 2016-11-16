import {Component} from "@angular/core";
import {TenantService} from "../../services/tenant.service";

@Component({
    selector: 'front-page',
    templateUrl: 'front-page.component.html',
    styleUrls: ['front-page.component.css']
})
export class FrontPageComponent {

    private tenantSlug: string;

    constructor(tenantService: TenantService) {
        tenantService.getTenant().subscribe(response => this.tenantSlug = response.slug);
    }

}