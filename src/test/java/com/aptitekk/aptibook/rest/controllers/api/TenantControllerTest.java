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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

public class TenantControllerTest extends AbstractWebClientTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantManagementService tenantManagementService;

    @Test
    public void testGetTenant() throws Exception {
        Tenant tenant = new Tenant();
        tenant.setSlug("testSlug");
        tenant.setTier(Tenant.Tier.PLATINUM);
        tenant.setActive(true);

        tenant = this.tenantRepository.save(tenant);
        this.tenantManagementService.refresh();

        this.mockMvc.perform(MockMvcRequestBuilders.get("/api/" + tenant.getSlug() + "/tenant"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.content().json("{id: " + tenant.getId() + ", slug: " + tenant.getSlug() + "}"));
    }

}