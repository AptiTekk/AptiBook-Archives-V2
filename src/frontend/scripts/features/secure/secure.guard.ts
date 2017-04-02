/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate, UrlSegment} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../../core/services/auth.service";

@Injectable()
export class SecureGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.authService.getUser().take(1).subscribe(
                user => {
                    if (user) {
                        listener.next(true);
                    } else {
                        let urlSegments: UrlSegment[] = route.url;
                        for (let segment of urlSegments) {
                            if (segment.toString() === "secure") {
                                this.router.navigate(['', 'sign-in']);
                                break;
                            }
                        }
                        listener.next(false);
                    }
                });
        }).take(1);
    }

}