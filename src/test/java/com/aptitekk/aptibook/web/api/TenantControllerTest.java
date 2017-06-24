/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api;

import com.aptitekk.aptibook.AbstractWebClientTest;
import org.junit.Test;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class TenantControllerTest extends AbstractWebClientTest {

    @Test
    public void testGetTenant() throws Exception {
        this.mockMvc.perform(get("/api/tenant"))
                .andExpect(jsonPath("$.id", is(getJUnitTenant().getId().intValue())))
                .andExpect(jsonPath("$.domain", is(getJUnitTenant().getDomain())));
    }

}