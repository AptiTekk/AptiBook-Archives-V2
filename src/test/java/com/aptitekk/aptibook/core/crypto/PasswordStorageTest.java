/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.crypto;

import com.aptitekk.AbstractWebClientTest;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;


public class PasswordStorageTest extends AbstractWebClientTest {

    @Test
    public void testSamePasswordHashesAreDifferent() throws Exception {
        String password = PasswordGenerator.generateRandomPassword(50);

        String passwordHash1 = PasswordStorage.createHash(password);
        String passwordHash2 = PasswordStorage.createHash(password);

        assertThat(passwordHash1).isNotEqualTo(passwordHash2);
    }

    @Test
    public void testPasswordIsValid() throws Exception {
        String password = PasswordGenerator.generateRandomPassword(50);

        String passwordHash = PasswordStorage.createHash(password);

        assertThat(PasswordStorage.verifyPassword(password, passwordHash)).isTrue();
    }
}