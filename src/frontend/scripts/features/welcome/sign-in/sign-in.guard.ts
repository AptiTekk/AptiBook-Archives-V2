/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {TenantService} from "../../../core/services/tenant.service";
import {CurrentUserService} from "../../../core/services/current-user.service";

@Injectable()
export class SignInGuard implements CanActivate {

    constructor(private tenantService: TenantService,
                private currentUserService: CurrentUserService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.tenantService.getTenant().take(1).subscribe(
                tenant => {
                    // Check if user is already signed in.
                    this.currentUserService.getCurrentUser()
                        .subscribe(
                            user => {
                                if (user != null) {
                                    // Already signed in, no point in being on sign in page.
                                    resolve(false);
                                } else {
                                    // Not signed in. Check auth method.
                                    if (tenant.authenticationMethod === 'BUILT_IN') {
                                        // Built in authentication means we should be on the welcome page.
                                        resolve(true);
                                    } else if (tenant.authenticationMethod === 'CAS') {
                                        // CAS authentication needs to redirect to the CAS Server.
                                        // Redirect to CAS entry endpoint, which will redirect to the correct server.
                                        window.location.href = "/api/cas/entry";
                                        resolve(false);
                                    }
                                }
                            }
                        );
                });
        });
    }
}