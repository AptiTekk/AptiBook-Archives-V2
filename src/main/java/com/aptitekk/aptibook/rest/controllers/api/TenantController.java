/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.repositories.PropertiesRepository;
import com.aptitekk.aptibook.core.domain.rest.dtos.TenantDTO;
import com.aptitekk.aptibook.rest.controllers.api.annotations.APIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

@APIController
public class TenantController extends APIControllerAbstract {

    private final PropertiesRepository propertiesRepository;

    @Autowired
    public TenantController(PropertiesRepository propertiesRepository) {
        this.propertiesRepository = propertiesRepository;
    }

    @RequestMapping(value = "/tenant", method = RequestMethod.GET)
    public ResponseEntity<?> getTenant(HttpServletRequest request) {
        Object tenantAttribute = request.getAttribute("tenant");
        if (tenantAttribute != null && tenantAttribute instanceof Tenant) {
            Tenant tenant = (Tenant) tenantAttribute;
            TenantDTO tenantDTO = modelMapper.map(tenant, TenantDTO.class);
            return ok(tenantDTO);
        }
        return badRequest("Tenant is Inactive");
    }

}
