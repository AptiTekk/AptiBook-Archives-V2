/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {SearchService} from "../../../core/services/search.service";

@Injectable()
export class SearchResultsGuard implements CanActivate {

    constructor(private searchService: SearchService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.searchService.getSearchResults().take(1).subscribe(results => {
                if (results) {
                    listener.next(true);
                } else {
                    this.router.navigate(['', 'secure']);
                    listener.next(false);
                }
            })
        }).take(1);
    }

}