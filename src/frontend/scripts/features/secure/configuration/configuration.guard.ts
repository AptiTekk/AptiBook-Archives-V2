/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {PermissionsService} from "../../../core/services/permissions.service";
import {AuthService} from "../../../core/services/auth.service";

@Injectable()
export class ConfigurationGuard implements CanActivate {

    constructor(private authService: AuthService,
                private permissionsService: PermissionsService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.authService.getCurrentUser().take(1).subscribe(
                user => {
                    if (user) {
                        if (user.admin) {
                            resolve(true);
                        } else {
                            this.permissionsService.getCurrentUserPermissions()
                                .take(1).subscribe(
                                permissions => {
                                    if (permissions.length > 0) {
                                        resolve(true);
                                    } else {
                                        this.router.navigate(['secure']);
                                        resolve(false);
                                    }
                                }
                            );
                        }
                    }
                }
            );
        });
    }

}