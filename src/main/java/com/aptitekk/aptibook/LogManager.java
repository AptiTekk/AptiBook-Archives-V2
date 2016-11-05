/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogManager {

    private static final Logger log = LoggerFactory.getLogger(LogManager.class);

    public static void log(String message) {
        log.info(message);
    }

}
