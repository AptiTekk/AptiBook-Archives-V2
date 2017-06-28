/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {User} from "../../models/user.model";

@Injectable()
export class RegistrationService {

    constructor(private apiService: APIService) {
    }

    /**
     * Registers a new user with the details provided in the User object.
     * @param user The User containing the details of the new user.
     * @returns A Promise that gives the new User.
     */
    public register(user: User): Promise<any> {
        return this.apiService.post("register", user);
    }

    /**
     * Gets any partially-filled user details for registration.
     * @param token The token used for registration.
     * @returns A Promise that gives the partially-filled User.
     */
    public getRegistrationDetails(token: string): Promise<User> {
        return this.apiService.get("register/details?token=" + token);
    }

    /**
     * Registers using the registration token.
     * @param user The user details for registration.
     * @param token The token used for registration.
     * @returns A Promise that gives the newly created User.
     */
    public finishRegistration(user: User, token: string): Promise<User> {
        return this.apiService.post("register/sso?token=" + token, user);
    }
}
