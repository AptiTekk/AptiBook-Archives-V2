/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {RegistrationService} from "../../core/services/registration.service";
@Injectable()
export class RegisterGuard implements CanActivate {

    constructor(private registrationService: RegistrationService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let token = route.queryParams['token'];
            // Make sure a token exists.
            if (token == null) {
                resolve(false);
                this.router.navigate(['']);
            } else {
                // Try to use the token to get details
                this.registrationService.getRegistrationDetails(token)
                    .then(
                        user => { // Token valid
                            resolve(true);
                        }
                    )
                    .catch(
                        err => { // Token not valid
                            resolve(false);
                            this.router.navigate(['']);
                        }
                    )
            }
        });
    }

}