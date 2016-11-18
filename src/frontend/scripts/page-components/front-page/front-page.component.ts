import {Component} from "@angular/core";
import {TenantService} from "../../services/tenant.service";
import {OAuthService} from "../../services/oauth.service";

@Component({
    selector: 'front-page',
    templateUrl: 'front-page.component.html',
    styleUrls: ['front-page.component.css']
})
export class FrontPageComponent {

    private tenantSlug: string;

    constructor(tenantService: TenantService, oAuthService: OAuthService) {
        tenantService.getTenant().subscribe(response => this.tenantSlug = response.slug);
        oAuthService.reloadOAuthURLs();
    }

}