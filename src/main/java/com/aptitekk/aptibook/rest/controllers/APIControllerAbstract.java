/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers;

import com.aptitekk.aptibook.core.domain.rest.RestError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api")
public abstract class APIControllerAbstract {

    ResponseEntity<Object> ok(Object entity) {
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    ResponseEntity<Object> badRequest() {
        return badRequest(null);
    }

    ResponseEntity<Object> badRequest(String message) {
        return new ResponseEntity<>(new RestError(message), HttpStatus.BAD_REQUEST);
    }

    ResponseEntity<Object> unauthorized() {
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

}
