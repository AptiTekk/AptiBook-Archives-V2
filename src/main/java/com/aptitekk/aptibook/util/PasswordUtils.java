/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;

/**
 * Utility methods for working with passwords.
 */
public class PasswordUtils {

    /**
     * The password encoded provided by Spring Security.
     */
    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    /**
     * When a password is generated with generateRandomPassword, characters will be randomly selected from this string.
     */
    private static final String RANDOM_PASSWORD_CHARS = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789+@";

    /**
     * Encodes the raw password into a hashed password suitable for storing in the database.
     *
     * @param rawPassword The raw password to be encoded.
     * @return The encoded password.
     */
    public static String encodePassword(String rawPassword) {
        return PASSWORD_ENCODER.encode(rawPassword);
    }

    /**
     * Determines if the raw password matches the encoded password.
     *
     * @param rawPassword     The raw password (supplied by the user)
     * @param encodedPassword The encoded password (from the database)
     * @return True if the passwords match, false otherwise.
     */
    public static boolean passwordsMatch(String rawPassword, String encodedPassword) {
        return PASSWORD_ENCODER.matches(rawPassword, encodedPassword);
    }

    /**
     * Generates a random String suitable for use as a temporary password.
     *
     * @param length The length of the password, in characters.
     * @return A random password with the specified length.
     */
    public static String generateRandomPassword(int length) {
        StringBuilder passwordBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = (int) (new SecureRandom().nextDouble() * RANDOM_PASSWORD_CHARS.length());
            passwordBuilder.append(RANDOM_PASSWORD_CHARS.charAt(index));
        }
        return passwordBuilder.toString();
    }
}
