/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk;

import com.gargoylesoftware.htmlunit.WebClient;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.htmlunit.webdriver.MockMvcHtmlUnitDriverBuilder;
import org.springframework.transaction.annotation.Transactional;

@SuppressWarnings("SpringJavaAutowiredMembersInspection")
@RunWith(SpringRunner.class)
@ActiveProfiles(profiles = "testing")
@WebMvcTest
@AutoConfigureDataJpa
@Transactional
public abstract class AbstractWebClientTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected WebClient webClient;

    protected HtmlUnitDriver webDriver;

    @Before
    public void setUp() throws Exception {
        this.webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);

        this.webDriver = MockMvcHtmlUnitDriverBuilder.mockMvcSetup(mockMvc).build();
    }

}
