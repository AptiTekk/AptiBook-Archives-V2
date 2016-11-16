import {AuthService} from "../../services/auth.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class FrontPageGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.getUser().map(
            user => {
                this.router.navigateByUrl("/secure");
                return false;
            }).catch(() => {
            return Observable.of(true);
        });
    }

}