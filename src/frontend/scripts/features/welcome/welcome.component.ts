/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {AfterViewInit, Component, OnInit} from "@angular/core";
import {TenantService} from "../../core/services/tenant.service";
import {Tenant} from "../../models/tenant.model";

@Component({
    selector: 'at-welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.css']
})
export class WelcomeComponent implements AfterViewInit {

    tenant: Tenant;
    tenantName: string;

    constructor(private tenantService: TenantService) {
    }

    ngAfterViewInit(): void {
        this.tenantService.getTenant().subscribe(response => this.tenant = response);
        this.tenantService.getTenantName().subscribe(name => this.tenantName = name);
    }
}