/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web;

import com.aptitekk.aptibook.web.api.RestError;
import com.aptitekk.aptibook.service.tenant.TenantManagementService;
import com.aptitekk.aptibook.web.util.WebURIBuilderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Collections;

public interface RestOperations {

    WebURIBuilderService getWebURIBuilderService();

    TenantManagementService getTenantManagementService();

    default ResponseEntity<?> ok(Object entity) {
        return ResponseEntity.ok(entity);
    }

    default ResponseEntity<?> created(Object entity, String endpoint) {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();

        headers.put("Location", Collections.singletonList(endpoint));

        return new ResponseEntity<>(entity, headers, HttpStatus.CREATED);
    }

    default ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    default ResponseEntity<Object> notFound() {
        return badRequest("");
    }

    default ResponseEntity<Object> notFound(String message) {
        return createErrorResponseEntity(message, HttpStatus.NOT_FOUND);
    }

    default ResponseEntity<Object> badRequest() {
        return badRequest("");
    }

    default ResponseEntity<Object> badRequest(String message) {
        return createErrorResponseEntity(message, HttpStatus.BAD_REQUEST);
    }

    default ResponseEntity<Object> unauthorized() {
        return unauthorized("");
    }

    default ResponseEntity<Object> unauthorized(String message) {
        return createErrorResponseEntity(message, HttpStatus.UNAUTHORIZED);
    }

    default ResponseEntity<Object> noPermission() {
        return createErrorResponseEntity("You do not have permission.", HttpStatus.UNAUTHORIZED);
    }

    default ResponseEntity<Object> noPermission(String message) {
        return createErrorResponseEntity(message, HttpStatus.UNAUTHORIZED);
    }

    default ResponseEntity<Object> serverError() {
        return serverError("Internal Server Error");
    }

    default ResponseEntity<Object> serverError(String message) {
        return createErrorResponseEntity(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    default ResponseEntity<?> notImplemented() {
        return notImplemented("This is not available.");
    }

    default ResponseEntity<Object> notImplemented(String message) {
        return createErrorResponseEntity(message, HttpStatus.NOT_IMPLEMENTED);
    }

    default ResponseEntity<Object> createErrorResponseEntity(String message, HttpStatus httpStatus) {
        return ResponseEntity.status(httpStatus).body(new RestError(message));
    }

}
