import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";
import {User} from "../domain/user";

@Injectable()
export class AuthService {

    private user: ReplaySubject<any> = new ReplaySubject(1);

    constructor(private apiService: APIService) {
        apiService.get("auth/sign-in").subscribe(
            response => this.user.next(<User>response),
            err => this.user = undefined
        );
    }

    public getUser(): ReplaySubject<any> {
        return this.user;
    }

}