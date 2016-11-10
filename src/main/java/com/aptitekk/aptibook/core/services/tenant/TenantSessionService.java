/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.tenant;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.services.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.time.ZoneId;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class TenantSessionService implements Serializable {

    @Autowired
    private TenantManagementService tenantManagementService;

    @Autowired
    private TenantService tenantService;

    @Autowired
    private HttpServletRequest httpRequest;

    @PostConstruct
    private void init() {
        try {
            if (httpRequest != null)
                httpRequest.getAttribute("tenant");
        } catch (Exception ignored) {
            httpRequest = null;
        }
    }

    public Tenant getCurrentTenant() {
        if (httpRequest != null) {
            Object attribute = httpRequest.getAttribute("tenant");
            if (attribute != null && attribute instanceof Tenant)
                return (Tenant) attribute;
        }

        return null;
    }

    public ZoneId getCurrentTenantZoneId() {
        Tenant tenant = getCurrentTenant();
        if (tenant != null) {
            return tenantManagementService.getZoneId(tenant);
        }
        return ZoneId.systemDefault();
    }


}
