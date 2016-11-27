/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

public class UserDTO {

    public Long id;

    public String emailAddress;

    public String firstName;

    public String lastName;

    public String phoneNumber;

    public String location;

    public List<UserGroupDTO.WithOnlyName> userGroups;

    public String getFullName() {
        return firstName != null ? firstName + " " + lastName : emailAddress;
    }

    public static class WithNewPassword extends UserDTO {
        public String newPassword;
    }

    @JsonIgnoreProperties({"userGroups"})
    public static class WithoutUserGroups extends UserDTO {
    }

}

