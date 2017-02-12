/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.AbstractWebClientTest;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class TenantControllerTest extends AbstractWebClientTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantManagementService tenantManagementService;

    @Test
    public void testGetTenant() throws Exception {
        Tenant tenant = new Tenant();
        tenant.slug = "testSlug";
        tenant.tier = Tenant.Tier.PLATINUM;
        tenant.setActive(true);

        tenant = this.tenantRepository.save(tenant);
        this.tenantManagementService.refresh();

        this.mockMvc.perform(get("/api/" + tenant.slug + "/tenant"))
                .andExpect(jsonPath("$.id", is(tenant.id.intValue())))
                .andExpect(jsonPath("$.slug", is(tenant.slug)));
    }

}