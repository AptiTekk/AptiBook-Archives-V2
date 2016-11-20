import {Component} from "@angular/core";
import {TenantService} from "../../services/singleton/tenant.service";
import {OAuthService} from "../../services/stateful/oauth.service";

@Component({
    selector: 'front-page',
    templateUrl: 'front-page.component.html',
    styleUrls: ['front-page.component.css'],
    providers: [OAuthService]
})
export class FrontPageComponent {

    private tenantSlug: string;

    constructor(tenantService: TenantService, oAuthService: OAuthService) {
        tenantService.getTenant().subscribe(response => this.tenantSlug = response.slug);
    }

}