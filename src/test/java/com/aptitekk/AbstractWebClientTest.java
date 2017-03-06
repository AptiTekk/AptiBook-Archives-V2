/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.gargoylesoftware.htmlunit.WebClient;
import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.htmlunit.webdriver.MockMvcHtmlUnitDriverBuilder;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;

import static org.mockito.BDDMockito.given;

@SuppressWarnings({"SpringJavaAutowiredMembersInspection", "SpringJavaAutowiringInspection"})
@RunWith(SpringRunner.class)
@ActiveProfiles(profiles = "testing")
@WebMvcTest
@AutoConfigureDataJpa
@Transactional
@Sql(scripts = "classpath:/junit-tenant.sql")
public abstract class AbstractWebClientTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected WebClient webClient;

    protected HtmlUnitDriver webDriver;

    @SpyBean
    private TenantManagementService tenantManagementService;

    private Tenant jUnitTenant;

    @Before
    public void setUp() throws Exception {
        this.webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);
        this.webDriver = MockMvcHtmlUnitDriverBuilder.mockMvcSetup(mockMvc).build();

        // Set up the JUnit Tenant and mock it as the current tenant.
        tenantManagementService.refresh();
        this.jUnitTenant = tenantManagementService.getTenantBySlug("junit");
        given(tenantManagementService.getTenant()).willReturn(jUnitTenant);
    }

    /**
     * The JUnit Tenant is the tenant created specifically for JUnit testing.
     * @return The JUnit Tenant.
     */
    protected Tenant getJUnitTenant() {
        return this.jUnitTenant;
    }

    /**
     * Retrieves the contents of a File from the resources directory.
     *
     * @param filePath The file path (from within resources).
     * @return The contents of the file as a String.
     */
    protected String getFileContents(String filePath) {
        InputStream stream = getClass().getClassLoader().getResourceAsStream(filePath);
        if (stream == null) {
            System.err.println("File not found. Could not get file contents for " + filePath);
            return null;
        }

        try {
            return IOUtils.toString(stream, Charset.defaultCharset());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Retrieves the contents of a File as a JSONObject from the resources directory.
     * @param filePath The file path (from within resources).
     * @return The contents of the file as a JSONObject.
     */
    protected JSONObject getJsonObjectFromFile(String filePath) {
        String json = getFileContents(filePath);

        if (json == null)
            return null;

        try {
            return new JSONObject(json);
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

}
