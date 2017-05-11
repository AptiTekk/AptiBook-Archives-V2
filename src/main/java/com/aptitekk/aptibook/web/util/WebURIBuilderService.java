/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.util;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.SpringProfileService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;
import java.net.URI;

@Service
public class WebURIBuilderService {

    private final HttpServletRequest httpServletRequest;
    private final SpringProfileService springProfileService;
    private final TenantManagementService tenantManagementService;
    private final LogService logService;

    @Autowired
    public WebURIBuilderService(HttpServletRequest httpServletRequest,
                                SpringProfileService springProfileService,
                                TenantManagementService tenantManagementService,
                                LogService logService) {
        this.httpServletRequest = httpServletRequest;
        this.springProfileService = springProfileService;
        this.tenantManagementService = tenantManagementService;
        this.logService = logService;
    }

    /**
     * Builds a full URI using the current Tenant as the subdomain, if one exists.
     *
     * @param pathFromRoot The path the URI will point to from the root of the url. (E.x.: "/api/endpoint")
     * @param queryParams  Parameters to be passed in URI. (?foo=bar&john=doe)
     * @return Built URI, or null if an exception occurred.
     */
    public URI buildURI(@Nullable String pathFromRoot, @Nullable MultiValueMap<String, String> queryParams) {
        Tenant currentTenant = tenantManagementService.getTenant();

        UriComponentsBuilder builder;

        // Try to get the builder from the current request, otherwise just use a default URL.
        try {
            builder = ServletUriComponentsBuilder.fromCurrentContextPath();
        } catch (IllegalStateException e) {
            // Include subdomain into default url if tenant is not null.
            builder = UriComponentsBuilder.fromHttpUrl("https://" + (currentTenant != null ? currentTenant.domain + "." : "") + "aptibook.net/");
        }

        // Set the path
        builder.path(pathFromRoot != null ? pathFromRoot : "/");

        // Set to https if in production mode.
        if (springProfileService.isProfileActive(SpringProfileService.Profile.PRODUCTION))
            builder.scheme("https");

        builder.queryParams(queryParams);

        // Build.
        return builder.build().toUri();
    }

}
