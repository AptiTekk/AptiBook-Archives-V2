/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.util;

import com.aptitekk.aptibook.AbstractWebClientTest;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class PasswordGeneratorTest extends AbstractWebClientTest {

    @Test
    public void testPasswordGeneratorLength() throws Exception {
        String password = PasswordUtils.generateRandomPassword(10);

        assertThat(password.length()).isEqualTo(10);
    }

    @Test
    public void testPasswordGeneratorCharacters() throws Exception {
        String password = PasswordUtils.generateRandomPassword(200);

        assertThat(password).matches("[a-zA-Z0-9+@]+");
    }
}