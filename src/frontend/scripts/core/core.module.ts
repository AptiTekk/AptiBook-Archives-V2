/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule, Optional, SkipSelf} from "@angular/core";
import {APIService} from "./services/api.service";
import {HelpService} from "./services/help.service";
import {EmailService} from "./services/email-service";
import {AuthService} from "./services/auth.service";
import {PropertiesService} from "./services/properties-service";
import {OAuthService} from "./services/oauth.service";
import {NotificationService} from "./services/notification.service";
import {ReservationDetailsService} from "./services/reservation-details.service";
import {ResourceCategoryService} from "./services/resource-category.service";
import {ReservationManagementService} from "./services/reservation-management.service";
import {SearchService} from "./services/search.service";
import {UserGroupService} from "./services/usergroup.service";
import {UserService} from "./services/user.service";
import {RegistrationService} from "./services/registration.service";
import {ReservationService} from "./services/reservation.service";
import {TenantService} from "./services/tenant.service";
import {ResourceService} from "./services/resource.service";
import {LoaderService} from "./services/loader.service";

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        APIService,
        AuthService,
        EmailService,
        HelpService,
        LoaderService,
        NotificationService,
        OAuthService,
        PropertiesService,
        RegistrationService,
        ReservationService,
        ReservationDetailsService,
        ReservationManagementService,
        ResourceService,
        ResourceCategoryService,
        SearchService,
        TenantService,
        UserService,
        UserGroupService
    ],
})
export class CoreModule {

    constructor(@Optional() @SkipSelf() otherCoreModule: CoreModule) {
        if(otherCoreModule) {
            throw new Error("The Core Module was imported twice. It can only be imported once (in the root module)");
        }
    }

}
