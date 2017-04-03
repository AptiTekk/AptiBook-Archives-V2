/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.security;

import com.aptitekk.AbstractWebClientTest;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import org.junit.Test;

import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;


public class PasswordUtilsTest extends AbstractWebClientTest {

    @Test
    public void testSamePasswordHashesAreDifferent() throws Exception {
        String password = PasswordGenerator.generateRandomPassword(50);

        String passwordHash1 = PasswordUtils.encodePassword(password);
        String passwordHash2 = PasswordUtils.encodePassword(password);

        assertNotEquals(passwordHash1, passwordHash2);
    }

    @Test
    public void testPasswordIsValid() throws Exception {
        String password = PasswordGenerator.generateRandomPassword(50);

        String passwordHash = PasswordUtils.encodePassword(password);

        assertTrue(PasswordUtils.passwordsMatch(password, passwordHash));
    }
}