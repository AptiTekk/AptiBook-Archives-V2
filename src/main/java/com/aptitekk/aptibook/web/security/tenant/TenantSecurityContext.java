/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.security.tenant;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;

public class TenantSecurityContext implements SecurityContext {

    @Override
    public Authentication getAuthentication() {
        return null;
    }

    @Override
    public void setAuthentication(Authentication authentication) {

    }

}
