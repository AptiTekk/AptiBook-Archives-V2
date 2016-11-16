import {Component} from "@angular/core";
import {TenantService} from "../../services/tenant.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'front-page',
    templateUrl: 'front-page.component.html',
    styleUrls: ['front-page.component.css']
})
export class FrontPageComponent {

    private tenantSlug: string;

    constructor(router: Router, tenantService: TenantService, authService: AuthService) {
        authService.getUser().subscribe(
            response => router.navigateByUrl("/secure"),
            err => err);
        tenantService.getTenant().subscribe(response => this.tenantSlug = response.slug);
    }

}