/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk;

import com.gargoylesoftware.htmlunit.WebClient;
import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;
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

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;

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
