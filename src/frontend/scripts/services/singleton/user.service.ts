import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {User} from "../../models/user.model";
import {Observable} from "rxjs";
import {isNullOrUndefined} from "util";
import {Reservation} from "../../models/reservation.model";

@Injectable()
export class UserService {

    constructor(private apiService: APIService) {
    }

    patchUser(user: User): Observable<boolean> {
        return Observable.create(listener => {
            if (isNullOrUndefined(user))
                listener.next(false);
            else {
                this.apiService.patch("users/" + user.id, user).subscribe(
                    response => listener.next(true),
                    err => listener.next(false));
            }
        });
    }

}