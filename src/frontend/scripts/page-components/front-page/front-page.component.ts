/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";
import {TenantService} from "../../core/services/tenant.service";
import {OAuthService} from "../../core/services/oauth.service";
import {Tenant} from "../../models/tenant.model";

@Component({
    selector: 'front-page',
    templateUrl: 'front-page.component.html',
    styleUrls: ['front-page.component.css']
})
export class FrontPageComponent implements OnInit {

    private tenant: Tenant;

    constructor(private tenantService: TenantService) {
    }

    ngOnInit(): void {
        this.tenantService.getTenant().subscribe(response => this.tenant = response);
    }
}