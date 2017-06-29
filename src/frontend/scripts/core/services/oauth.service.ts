/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";

@Injectable()
export class OAuthService {

    private googleOAuthUrl: ReplaySubject<string> = new ReplaySubject<string>(1);

    constructor(private apiService: APIService) {
    }

    /**
     * Forces a reload of the OAuth URLs.
     */
    public reloadOAuthURLs() {

        //Reload Google URL
        this.apiService.get("/oauth/google")
            .then(url => this.googleOAuthUrl.next(url))
            .catch(err => this.googleOAuthUrl.next(undefined));
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