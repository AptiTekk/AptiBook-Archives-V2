/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

export interface Tenant {

    /* The Tenant's subdomain name */
    domain: string;

    /* The Tenant's personalized organization name, if set. */
    name: string;

    /* The Tenant's authentication method */
    authenticationMethod: string;
}