import {AuthService} from "../../services/singleton/auth.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {TenantService} from "../../services/singleton/tenant.service";

@Injectable()
export class FrontPageGuard implements CanActivate {

    constructor(private authService: AuthService,
                private tenantService: TenantService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return Observable.create(listener => {
            this.tenantService.getTenant().take(1).subscribe(
                tenant => {
                    if (tenant) {
                        this.authService.getUser().take(1).subscribe(
                            user => {
                                if (user) {
                                    this.router.navigate(['', 'secure']);
                                    listener.next(false);
                                } else {
                                    listener.next(true);
                                }
                            });
                    } else {
                        this.router.navigate(['', 'inactive'], {skipLocationChange: true});
                        listener.next(false);
                    }
                });
        }).take(1);
    }
}