/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../../core/services/auth.service";
import {TenantService} from "../../core/services/tenant.service";

@Injectable()
export class WelcomeGuard implements CanActivate {

    constructor(private authService: AuthService,
                private tenantService: TenantService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.tenantService.getTenant().take(1).subscribe(
                tenant => {
                    if (tenant) {
                        this.authService.getCurrentUser().take(1).subscribe(
                            user => {
                                if (user) {
                                    this.router.navigate(['', 'secure']);
                                    listener.next(false);
                                } else {
                                    listener.next(true);
                                }
                            });
                    } else {
                        this.router.navigate(['', 'inactive'], {skipLocationChange: true});
                        listener.next(false);
                    }
                });
        }).take(1);
    }
}