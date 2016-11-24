/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.rest.controllers.api;

import com.aptitekk.aptibook.core.domain.rest.RestError;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.auth.AuthService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("SpringAutowiredFieldsWarningInspection")
public abstract class APIControllerAbstract {

    ModelMapper modelMapper = new ModelMapper();

    @Autowired
    AuthService authService;

    @Autowired
    LogService logService;

    APIControllerAbstract() {
        modelMapper.getConfiguration().setFieldMatchingEnabled(true);
    }

    ResponseEntity<?> ok(Object entity) {
        return ResponseEntity.ok(entity);
    }

    ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    ResponseEntity<Object> badRequest() {
        return badRequest("");
    }

    ResponseEntity<Object> badRequest(String message) {
        return createErrorResponseEntity(message, HttpStatus.BAD_REQUEST);
    }

    ResponseEntity<Object> unauthorized() {
        return unauthorized("");
    }

    ResponseEntity<Object> unauthorized(String message) {
        return createErrorResponseEntity(message, HttpStatus.UNAUTHORIZED);
    }

    ResponseEntity<Object> noPermission() {
        return createErrorResponseEntity("You do not have permission.", HttpStatus.UNAUTHORIZED);
    }

    ResponseEntity<Object> serverError() {
        return serverError("Internal Server Error");
    }

    ResponseEntity<Object> serverError(String message) {
        return createErrorResponseEntity(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    ResponseEntity<?> notImplemented() {
        return notImplemented("This is not available.");
    }

    ResponseEntity<Object> notImplemented(String message) {
        return createErrorResponseEntity(message, HttpStatus.NOT_IMPLEMENTED);
    }

    private ResponseEntity<Object> createErrorResponseEntity(String message, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new RestError(message));
    }

}
