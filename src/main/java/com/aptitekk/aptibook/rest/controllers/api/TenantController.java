/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.enums.Property;
import com.aptitekk.aptibook.core.domain.rest.dtos.TenantDTO;
import com.aptitekk.aptibook.core.services.entity.PropertyService;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@APIController
public class TenantController extends APIControllerAbstract {

    private final PropertyService propertyService;

    @Autowired
    public TenantController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @RequestMapping(value = "/tenant", method = RequestMethod.GET)
    public ResponseEntity<?> getTenant() {
        Tenant tenant = tenantManagementService.getTenant();

        if (tenant == null) {
            return badRequest("Tenant is Inactive");
        }

        TenantDTO tenantDTO = modelMapper.map(tenant, TenantDTO.class);
        return ok(tenantDTO);
    }

    @RequestMapping(value = "/tenant/name", method = RequestMethod.GET)
    public ResponseEntity<?> getTenantName() {
        Tenant tenant = tenantManagementService.getTenant();

        if (tenant == null) {
            return badRequest("Tenant is Inactive");
        }

        // Response: {"name": "Example"}
        try {
            return ok(new JSONObject().put("name", propertyService.getProperty(Property.Key.PERSONALIZATION_ORGANIZATION_NAME)).toString());
        } catch (JSONException e) {
            logService.logException(getClass(), e, "Could not create JSON for Tenant name.");
            return serverError();
        }
    }

}
