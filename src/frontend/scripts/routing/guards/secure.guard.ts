import {AuthService} from "../../services/auth.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class SecureGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.authService.getUser().subscribe(
                user => {
                    listener.next(true);
                },
                err => {
                    this.router.navigateByUrl("/");
                    listener.next(false);
                });
        }).take(1);
    }

}