/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web;

import com.aptitekk.aptibook.AbstractWebClientTest;
import org.eclipse.jetty.http.HttpStatus;
import org.junit.Test;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

public class StaticContentTest extends AbstractWebClientTest {

    @Test
    public void testIndexHtml() throws Exception {
        this.mockMvc.perform(get("/index.html"))
                .andExpect(MockMvcResultMatchers.status().is(HttpStatus.OK_200))
                .andExpect(MockMvcResultMatchers.content().contentType("text/html"));
    }

}