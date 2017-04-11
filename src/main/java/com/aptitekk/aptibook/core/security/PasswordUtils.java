/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility methods for working with passwords.
 */
public class PasswordUtils {

    /**
     * The password encoded provided by Spring Security.
     */
    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    /**
     * Encodes the raw password into a hashed password suitable for storing in the database.
     * @param rawPassword The raw password to be encoded.
     * @return The encoded password.
     */
    public static String encodePassword(String rawPassword) {
        return PASSWORD_ENCODER.encode(rawPassword);
    }

    /**
     * Determines if the raw password matches the encoded password.
     * @param rawPassword The raw password (supplied by the user)
     * @param encodedPassword The encoded password (from the database)
     * @return True if the passwords match, false otherwise.
     */
    public static boolean passwordsMatch(String rawPassword, String encodedPassword) {
        return PASSWORD_ENCODER.matches(rawPassword, encodedPassword);
    }

}
