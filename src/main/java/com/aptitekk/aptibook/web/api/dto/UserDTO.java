/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.voodoodyne.jackson.jsog.JSOGGenerator;

import java.util.List;

@JsonIdentityInfo(generator = JSOGGenerator.class)
public class UserDTO {

    public Long id;

    public String emailAddress;

    public String firstName;

    public String lastName;

    public String phoneNumber;

    public String location;

    public boolean verified;

    public List<UserGroupDTO.WithoutParentOrChildren> userGroups;

    //public Set<Notification.NotificationToggles> notificationSetting;

    public String fullName;

    public boolean admin;

    public static class WithNewPassword extends UserDTO {
        public String newPassword;
    }

    @JsonIgnoreProperties({"userGroups"})
    public static class WithoutUserGroups extends UserDTO {
    }

}

