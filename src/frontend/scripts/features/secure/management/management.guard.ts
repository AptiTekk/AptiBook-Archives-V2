/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../../../core/services/auth.service";

@Injectable()
export class ManagementGuard implements CanActivate {

    constructor(private authService: AuthService,
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
                            } else if (user.userGroups.length > 0) {
                                listener.next(true);
                                return;
                            }
                        }

                        this.router.navigate(['', 'secure']);
                        listener.next(false);
                    }
                );
            }
        ).take(
            1
        );
    }

}