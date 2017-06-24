/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Top level object for all API responses to maintain consistency across all requests.
 */
public class APIResponse extends ResponseEntity<Object> {

    public APIResponse(Object body, HttpStatus status) {
        super(body, status);
    }

    /**
     * Determines if the request processed successfully.
     *
     * @return True if the status code is 2xx or 3xx. False otherwise.
     */
    public boolean isOk() {
        return this.getStatusCode().is2xxSuccessful() || this.getStatusCode().is3xxRedirection();
    }

    /**
     * A machine readable error message, if needed.
     *
     * @return The machine readable error message if one exists, or null otherwise.
     */
    public String getError() {
        //TODO
        return null;
    }

}
