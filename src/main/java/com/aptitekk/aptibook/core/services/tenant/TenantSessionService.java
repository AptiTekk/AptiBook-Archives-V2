/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.tenant;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

@Service
public class TenantSessionService {

    private final HttpServletRequest request;

    @Autowired
    public TenantSessionService(HttpServletRequest request) {
        this.request = request;
    }

    public Tenant getTenant() {
        try {
            if (request != null) {
                Object attribute = request.getAttribute("tenant");
                if (attribute != null && attribute instanceof Tenant)
                    return (Tenant) attribute;
            }
        } catch (Exception ignored) {
            //No request
        }
        return null;
    }

}
