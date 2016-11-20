import {AuthService} from "../../services/auth.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {isNullOrUndefined} from "util";

@Injectable()
export class FrontPageGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.authService.getUser().take(1).subscribe(
                user => {
                    if (!isNullOrUndefined(user)) {
                        this.router.navigateByUrl("/secure/dashboard");
                        listener.next(false);
                    } else {
                        listener.next(true);
                    }
                });
        }).take(1);
    }
}