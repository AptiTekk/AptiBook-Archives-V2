/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Top level object for all API responses to maintain consistency across all requests.
 */
public class APIResponse extends ResponseEntity<Object> {

    /**
     * Creates an APIResponse with a 200 status code and the given content.
     *
     * @param content The content of the response.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse ok(Object content) {
        return buildAPIResponse(HttpStatus.OK, content, null, null, null);
    }

    /**
     * Creates an APIResponse with a 201 status code and the given content and location.
     *
     * @param content  The content of the response.
     * @param location The url to the endpoint at which the created resource can be accessed.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse created(Object content, String location) {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();

        headers.put("Location", Collections.singletonList(location));

        return buildAPIResponse(HttpStatus.CREATED, content, null, null, headers);
    }

    /**
     * Creates an APIResponse with a 204 status code.
     *
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse noContentResponse() {
        return buildAPIResponse(HttpStatus.NO_CONTENT, null, null, null, null);
    }

    /**
     * Creates an APIResponse with a 400 status code and the given error messages.
     *
     * @param error   (Optional) A machine readable error message.
     * @param message (Optional) A human readable message.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse badRequest(@Nullable String error, @Nullable String message) {
        return buildAPIResponse(HttpStatus.BAD_REQUEST, null, error, message, null);
    }

    /**
     * Creates an APIResponse with a 400 status code and pre-defined error messages.
     * Used when a field is missing from the request body.
     *
     * @param fieldName The name of the missing field.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse badRequestMissingField(@NotNull String fieldName) {
        return buildAPIResponse(HttpStatus.BAD_REQUEST, null, "missing_field", "The field '" + fieldName + "' is missing from the request body.", null);
    }

    /**
     * Creates an APIResponse with a 409 status code and pre-defined error messages.
     * Used when an entity is not unique and conflicts with another entity in the database.
     *
     * @param message (Optional) A human readable message.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse badRequestConflict(@Nullable String message) {
        return buildAPIResponse(HttpStatus.CONFLICT, null, "conflict", message, null);
    }

    /**
     * Creates an APIResponse with a 400 status code and pre-defined error messages.
     * Used when a field is too long.
     *
     * @param fieldName The name of the field.
     * @param maxLength The max length of the field.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse badRequestFieldTooLong(@NotNull String fieldName, @NotNull int maxLength) {
        return buildAPIResponse(HttpStatus.BAD_REQUEST, null, "max_length_exceeded", "The field '" + fieldName + "' exceeds the max length of " + maxLength + " characters.", null);
    }

    /**
     * Creates an APIResponse with a 400 status code and pre-defined error messages.
     * Used when a field is using invalid characters.
     *
     * @param fieldName         The name of the field.
     * @param invalidCharacters The characters that should not be in the field.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse badRequestInvalidCharacters(@NotNull String fieldName, @NotNull String invalidCharacters) {
        return buildAPIResponse(HttpStatus.BAD_REQUEST, null, "invalid_characters", "The field '" + fieldName + "' may not contain these characters: " + invalidCharacters, null);
    }

    /**
     * Creates an APIResponse with a 400 status code and pre-defined error messages.
     * Used when a field cannot be parsed.
     *
     * @param message (Optional) A human readable message.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse badRequestNotParsable(@Nullable String message) {
        return buildAPIResponse(HttpStatus.BAD_REQUEST, null, "not_parsable", message, null);
    }

    /**
     * Creates an APIResponse with a 401 status code and the given error messages.
     * Should be sent when the user is not authenticated.
     *
     * @param error   (Optional) A machine readable error message.
     * @param message (Optional) A human readable message.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse unauthorized(@Nullable String error, @Nullable String message) {
        return buildAPIResponse(HttpStatus.UNAUTHORIZED, null, error, message, null);
    }

    /**
     * Creates an APIResponse with a 403 status code and the given error messages.
     * Should be sent when the user is authenticated, but cannot perform an action they requested.
     *
     * @param message (Optional) A human readable message.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse forbidden(@Nullable String message) {
        return buildAPIResponse(HttpStatus.FORBIDDEN, null, "forbidden", message, null);
    }

    /**
     * Creates an APIResponse with a 403 status code and pre-defined error messages.
     * Should be sent when the user is authenticated, but lacks permissions.
     *
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse noPermission() {
        return buildAPIResponse(HttpStatus.FORBIDDEN, null, "no_permission", "You do not have permission to access this resource.", null);
    }

    /**
     * Creates an APIResponse with a 404 status code, a pre-defined error message, and an optional message.
     *
     * @param message (Optional) A human readable message.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse notFound(@Nullable String message) {
        return buildAPIResponse(HttpStatus.NOT_FOUND, null, "not_found", message, null);
    }

    /**
     * Creates an APIResponse with a 405 status code and pre-defined error messages.
     *
     * @param method The method that is not allowed.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse methodNotAllowed(@NotNull String method) {
        return buildAPIResponse(HttpStatus.METHOD_NOT_ALLOWED, null, "method_not_allowed", "The request method '" + method + "' is not allowed here.", null);
    }

    /**
     * Creates an APIResponse with a 415 status code and pre-defined error messages.
     *
     * @param mediaType The unsupported media type.
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse unsupportedMediaType(@NotNull MediaType mediaType) {
        return buildAPIResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, null, "unsupported_media_type", "The media type '" + mediaType + "' is not supported here.", null);
    }

    /**
     * Creates an APIResponse with a 500 status code and pre-defined error messages.
     *
     * @return The generated APIResponse.
     */
    @JsonIgnore
    public static APIResponse internalServerError() {
        return buildAPIResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                null,
                "internal_error",
                "An Internal Server Error occurred while processing your request. Contact AptiTekk at https://support.aptitekk.com/contact if this error persists.",
                null);
    }

    /**
     * Builds the APIResponse with the given, mostly optional, parameters.
     * This method is required to generate the JSON body for the ResponseEntity constructor.
     *
     * @param status  The status code. Not optional.
     * @param content (Optional) The content of the response.
     * @param error   (Optional) A machine readable error message.
     * @param message (Optional) A human readable message.
     * @param headers (Optional) Additional headers for the response.
     */
    @JsonIgnore
    private static APIResponse buildAPIResponse(HttpStatus status, Object content, String error, String message, MultiValueMap<String, String> headers) {
        Map<String, Object> body = new HashMap<>();

        // "ok", true if 2xx or 3xx code, false otherwise.
        body.put("ok", status.is2xxSuccessful() || status.is3xxRedirection());

        // The content of the response.
        if (content != null) body.put("content", content);

        // The machine readable error message.
        if (error != null) body.put("error", error);

        // The human readable message.
        if (message != null) body.put("message", message);

        // Construct APIResponse.
        return new APIResponse(status, body, headers);
    }

    /**
     * Constructs an APIResponse.
     * You should use {@link #buildAPIResponse(HttpStatus, Object, String, String, MultiValueMap)} instead of
     * calling this method directly.
     *
     * @param status  The status code. Not optional.
     * @param body    (Optional) The body of the response entity.
     * @param headers (Optional) Additional headers.
     */
    private APIResponse(HttpStatus status, Map<String, Object> body, MultiValueMap<String, String> headers) {
        super(body, headers, status);
    }

}
