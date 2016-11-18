import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";

@Injectable()
export class OAuthService {

    constructor(private apiService: APIService) {

    }

    public getGoogleOAuthUrl(): Observable<any> {
        return this.apiService.get("/oauthUrl/google");
    }

}