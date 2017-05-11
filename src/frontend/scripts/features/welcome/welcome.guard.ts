/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthService} from "../../core/services/auth.service";
import {TenantService} from "../../core/services/tenant.service";

@Injectable()
export class WelcomeGuard implements CanActivate {

    constructor(private authService: AuthService,
                private tenantService: TenantService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.tenantService.getTenant().take(1).subscribe(
                tenant => {
                    this.authService.getCurrentUser().take(1).subscribe(
                        user => {
                            // If the user exists, then they shouldn't be on the welcome page.
                            if (user) {
                                this.router.navigate(['secure']);
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                },
                err => {
                    // Tenant could not be found; inactive Tenant.
                    this.router.navigate(['inactive'], {skipLocationChange: true});
                    resolve(false);
                });
        });
    }
}