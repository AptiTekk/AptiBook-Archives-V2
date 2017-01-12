/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.security;

import com.aptitekk.AbstractWebClientTest;
import com.gargoylesoftware.htmlunit.Page;
import org.junit.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;

public class WebFilterTest extends AbstractWebClientTest {

    @Test
    public void testIndexPage() throws Exception {
        Page page = this.webClient.getPage("/");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(404);
    }

    @Test
    public void testPingPage() throws Exception {
        Page page = this.webClient.getPage("/ping");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentAsString()).isEqualToIgnoringCase("pong");
    }

    @Test
    public void testFavicons() throws Exception {
        Page page = this.webClient.getPage("/favicon.ico");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);

        page = this.webClient.getPage("/static/favicons/favicon.ico");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);
    }

    @Test
    public void testSplashScreen() throws Exception {
        Page page = this.webClient.getPage("/static/splashscreen/background.jpg");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);

        page = this.webClient.getPage("/static/splashscreen/logo.svg");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);
    }

    @Test
    public void testDefaultImages() throws Exception {
        Page page = this.webClient.getPage("/static/resource-no-image.svg");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);

        page = this.webClient.getPage("/static/user-no-image.svg");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);
    }

    @Test
    public void testPackedScripts() throws Exception {
        Page page = this.webClient.getPage("/packed/scripts/main.bundle.js");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);

        page = this.webClient.getPage("/packed/scripts/polyfills.bundle.js");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);

        page = this.webClient.getPage("/packed/scripts/vendor.bundle.js");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
        assertThat(page.getWebResponse().getContentLength()).isGreaterThan(0);
    }

    @Test
    public void testDemoIndexPage() throws Exception {
        Page page = this.webClient.getPage("/demo");

        assertThat(page.getWebResponse().getStatusCode()).isEqualTo(200);
    }
}