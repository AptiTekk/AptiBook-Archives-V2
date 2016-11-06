/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain;

public class RestError {

    private String errorMessage;

    public RestError(String errorMessage){
        this.errorMessage = errorMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RestError restError = (RestError) o;

        return errorMessage != null ? errorMessage.equals(restError.errorMessage) : restError.errorMessage == null;
    }

    @Override
    public int hashCode() {
        return errorMessage != null ? errorMessage.hashCode() : 0;
    }

}
