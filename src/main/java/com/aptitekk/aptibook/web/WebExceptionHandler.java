/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web;

import com.aptitekk.aptibook.core.domain.rest.RestError;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.rest.controllers.api.validators.RestValidator;
import org.hibernate.MappingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class WebExceptionHandler extends ResponseEntityExceptionHandler {

    private final ResourceLoader resourceLoader;
    private final LogService logService;

    @Autowired
    public WebExceptionHandler(ResourceLoader resourceLoader, LogService logService) {
        this.resourceLoader = resourceLoader;
        this.logService = logService;
    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        if (ex.getRequestURL().startsWith("/api"))
            // For API calls, send a rest error.
            return new ResponseEntity<>(new RestError("The URL you have reached is not in service at this time. (404)"), HttpStatus.NOT_FOUND);
        else {
            // For non-API calls, try to load the resource they asked for
            Resource resource = this.resourceLoader.getResource(ex.getRequestURL());

            // If it doesn't exist, load index.html
            if (!resource.exists())
                resource = this.resourceLoader.getResource("index.html");

            // Send the resource.
            return new ResponseEntity<>(resource, HttpStatus.OK);
        }
    }

    @ExceptionHandler(MappingException.class)
    protected ResponseEntity<Object> handleModelMappingException(MappingException ex) {
        logService.logException(getClass(), ex, "An error occurred while mapping an object to a DTO");
        return new ResponseEntity<>(new RestError("An Internal Server Error occurred while processing your request. (500)"), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    protected ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex) {
        logService.logException(getClass(), ex, "An error occurred while processing an endpoint request");
        return new ResponseEntity<>(new RestError("An Internal Server Error occurred while processing your request. (500)"), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RestValidator.RestValidationException.class)
    protected ResponseEntity<?> handleRestValidationException(RestValidator.RestValidationException ex) {
        return ex.getResponseEntity();
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        return new ResponseEntity<>(new RestError(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<?> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        return new ResponseEntity<>(new RestError("The passed in value for the '" + ex.getName() + "' path variable is not valid."), HttpStatus.BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers, HttpStatus status, WebRequest request) {
        if (ex instanceof HttpRequestMethodNotSupportedException) {
            return new ResponseEntity<>(new RestError("The Request Method you have specified (" + ((HttpRequestMethodNotSupportedException) ex).getMethod() + ") is not valid. (405)"), HttpStatus.METHOD_NOT_ALLOWED);
        }
        logService.logException(getClass(), ex, "An error occurred while processing an endpoint request");
        return new ResponseEntity<>(new RestError("An Internal Server Error occurred while processing your request. (500)"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
