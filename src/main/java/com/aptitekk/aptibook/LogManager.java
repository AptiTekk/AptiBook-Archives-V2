package com.aptitekk.aptibook;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogManager {

    private static final Logger log = LoggerFactory.getLogger(LogManager.class);

    public static void log(String message) {
        log.info(message);
    }

}
