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
import java.time.ZoneId;

@Service
public class TenantSessionService {

    private final HttpServletRequest request;

    //private final TenantManagementService tenantManagementService;

    @Autowired
    public TenantSessionService(HttpServletRequest request /*TenantManagementService tenantManagementService*/) {
        this.request = request;
       // this.tenantManagementService = tenantManagementService;
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

    /*public ZoneId getCurrentTenantZoneId() {
        Tenant tenant = getTenant();
        if (tenant != null) {
            return tenantManagementService.getZoneId(tenant);
        }
        return ZoneId.systemDefault();
    }*/

}
