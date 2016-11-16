import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";
import {Headers} from "@angular/http";

@Injectable()
export class AuthService {

    constructor(private apiService: APIService) {
    }

    public getUser(): Observable<any> {
        return this.apiService.get("auth/sign-in");
    }

    public signIn(username: String, password: String): Observable<any> {
        return this.apiService.get("auth/sign-in", new Headers({
            "Authorization": "Basic " + btoa(username + ":" + password)
        }));
    }

    public signOut(): Observable<any> {
        return this.apiService.get("auth/sign-out");
    }
}