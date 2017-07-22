/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.controllers;

import com.aptitekk.aptibook.domain.entities.Tenant;
import com.aptitekk.aptibook.domain.entities.property.Property;
import com.aptitekk.aptibook.web.api.APIResponse;
import com.aptitekk.aptibook.web.api.annotations.APIController;
import com.aptitekk.aptibook.web.api.dtos.TenantDTO;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@APIController
public class TenantController extends APIControllerAbstract {

    @RequestMapping(value = "/tenant", method = RequestMethod.GET)
    public APIResponse getTenant() {
        Tenant tenant = tenantManagementService.getTenant();

        if (tenant == null)
            return APIResponse.badRequest("inactive_tenant", "The AptiBook subscription you have accessed is not active.");

        TenantDTO tenantDTO = modelMapper.map(tenant, TenantDTO.class);

        // Set Organization Name
        tenantDTO.name = tenant.getProperties().get(Property.PERSONALIZATION_ORGANIZATION_NAME);

        // Set Authentication Method Status
        String authenticationMethod = tenant.getProperties().get(Property.AUTHENTICATION_METHOD);
        tenantDTO.authenticationMethod = authenticationMethod != null ? Property.AuthenticationMethod.valueOf(authenticationMethod) : Property.AuthenticationMethod.BUILT_IN;

        return APIResponse.okResponse(tenantDTO);
    }

}
