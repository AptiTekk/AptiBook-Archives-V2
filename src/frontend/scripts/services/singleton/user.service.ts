import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {User} from "../../models/user.model";
import {Observable} from "rxjs";

@Injectable()
export class UserService {

    constructor(private apiService: APIService) {
    }

    patchUser(user: User, passwordOnly: boolean = false): Observable<boolean> {
        return Observable.create(listener => {
            if (!user)
                listener.next(false);
            else {
                this.apiService.patch("users/" + user.id + (passwordOnly ? "?passwordOnly=true" : ""), user).subscribe(
                    response => listener.next(true),
                    err => listener.next(false));
            }
        });
    }

}