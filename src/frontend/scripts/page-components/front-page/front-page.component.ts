import {Component, OnInit} from "@angular/core";
import {TenantService} from "../../services/singleton/tenant.service";
import {OAuthService} from "../../services/stateful/oauth.service";
import {Tenant} from "../../models/tenant.model";

@Component({
    selector: 'front-page',
    templateUrl: 'front-page.component.html',
    styleUrls: ['front-page.component.css'],
    providers: [OAuthService]
})
export class FrontPageComponent implements OnInit {

    private tenant: Tenant;

    constructor(private tenantService: TenantService) {
    }

    ngOnInit(): void {
        this.tenantService.getTenant().subscribe(response => this.tenant = response);
    }
}