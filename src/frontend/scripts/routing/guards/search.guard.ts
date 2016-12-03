import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {SearchService} from "../../services/singleton/search.service";

@Injectable()
export class SearchGuard implements CanActivate {

    constructor(private searchService: SearchService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.searchService.getSearchResults().take(1).subscribe(results => {
                if (results != undefined) {
                    listener.next(true);
                } else {
                    this.router.navigateByUrl("/secure/");
                    listener.next(false);
                }
            })
        }).take(1);
    }

}