/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.enums.property.AuthenticationMethod;
import com.aptitekk.aptibook.core.domain.entities.enums.property.Property;
import com.aptitekk.aptibook.core.domain.rest.dtos.TenantDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@APIController
public class TenantController extends APIControllerAbstract {

    @RequestMapping(value = "/tenant", method = RequestMethod.GET)
    public ResponseEntity<?> getTenant() {
        Tenant tenant = tenantManagementService.getTenant();

        if (tenant == null) {
            return badRequest("Tenant is Inactive");
        }

        TenantDTO tenantDTO = modelMapper.map(tenant, TenantDTO.class);
        tenantDTO.name = tenant.properties.get(Property.Key.PERSONALIZATION_ORGANIZATION_NAME);
        String authenticationMethod = tenant.properties.get(Property.Key.AUTHENTICATION_METHOD);
        tenantDTO.authenticationMethod = authenticationMethod != null ? AuthenticationMethod.valueOf(authenticationMethod) : AuthenticationMethod.BUILT_IN;
        return ok(tenantDTO);
    }

}
