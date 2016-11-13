/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers;

import com.aptitekk.aptibook.core.domain.rest.RestError;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class APIControllerAbstract {

    @Autowired
    AuthService authService;

    @Autowired
    LogService logService;

    ResponseEntity<Object> ok() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    ResponseEntity<Object> ok(Object entity) {
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    ResponseEntity<Object> badRequest() {
        return badRequest("");
    }

    ResponseEntity<Object> badRequest(String message) {
        return new ResponseEntity<>(new RestError(message), HttpStatus.BAD_REQUEST);
    }

    ResponseEntity<Object> unauthorized() {
        return unauthorized("");
    }

    ResponseEntity<Object> unauthorized(String message) {
        return new ResponseEntity<>(new RestError(message), HttpStatus.UNAUTHORIZED);
    }

    ResponseEntity<Object> noPermission() {
        return new ResponseEntity<>(new RestError("You do not have permission."), HttpStatus.UNAUTHORIZED);
    }

}
