/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.dtos;

import java.util.List;

public class UserDTO {

    public Long id;

    public boolean admin;

    public String emailAddress;

    public String firstName;

    public String lastName;

    public String fullName;

    public List<UserGroupDTO> userGroups;

    public String phoneNumber;

    public String location;

    public static class WithNewPassword extends UserDTO {
        public String newPassword;
    }

}

