import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";

@Injectable()
export class OAuthService {

    private googleOAuthUrl: ReplaySubject<string> = new ReplaySubject<string>(1);

    constructor(private apiService: APIService) {
        this.reloadOAuthURLs();
    }

    /**
     * Forces a reload of the OAuth URLs.
     */
    public reloadOAuthURLs() {

        //Reload Google URL
        this.apiService.get("/oauthUrl/google").subscribe(
            response => {
                this.googleOAuthUrl.next(response.url);
            },
            err => {
                this.googleOAuthUrl.next(undefined);
            }
        );
    }

    /**
     * A valid URL for authenticating with Google.
     * @returns {ReplaySubject<string>} A ReplaySubject containing either
     * the URL as a string or undefined if Google Sign In is disabled.
     */
    public getGoogleOAuthUrl(): ReplaySubject<string> {
        return this.googleOAuthUrl;
    }

}