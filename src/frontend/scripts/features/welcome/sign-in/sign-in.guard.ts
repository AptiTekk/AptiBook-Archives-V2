/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../../../core/services/auth.service";
import {TenantService} from "../../../core/services/tenant.service";

@Injectable()
export class SignInGuard implements CanActivate {

    constructor(private authService: AuthService,
                private tenantService: TenantService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.tenantService.getTenant().take(1).subscribe(
                tenant => {
                    this.authService.getCurrentUser().take(1).subscribe(
                        user => {
                            if (tenant.authenticationMethod === 'BUILT_IN') // Built in authentication means we should be on the welcome page.
                                listener.next(true);
                            else if (tenant.authenticationMethod === 'CAS') // CAS authentication needs to redirect to the CAS Server.
                            {
                                // Redirect to CAS entry endpoint, which will redirect to the correct server.
                                window.location.href = "/api/cas/entry";
                                listener.next(false);
                            }
                        });
                });
        }).take(1);
    }
}