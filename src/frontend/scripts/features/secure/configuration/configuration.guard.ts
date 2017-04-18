/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {PermissionsService} from "../../../core/services/permissions.service";
import {AuthService} from "../../../core/services/auth.service";

@Injectable()
export class ConfigurationGuard implements CanActivate {

    constructor(private authService: AuthService,
                private permissionsService: PermissionsService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.authService.getCurrentUser().take(1).subscribe(
                user => {
                    if (user) {
                        if (user.admin) {
                            listener.next(true);
                            return;
                        } else {
                            this.permissionsService.getCurrentUserPermissions()
                                .subscribe(
                                    permissions => {
                                        if (permissions.length > 0) {
                                            listener.next(true);
                                        } else {
                                            this.router.navigate(['', 'secure']);
                                            listener.next(false);
                                        }
                                    }
                                );
                        }
                    }
                }
            );
        }).take(1);
    }

}