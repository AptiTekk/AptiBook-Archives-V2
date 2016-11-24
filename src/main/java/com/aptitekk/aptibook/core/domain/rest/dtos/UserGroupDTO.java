/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.rest.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

public class UserGroupDTO {

    public Long id;

    public String name;

    public UserGroupDTO parent;

    public List<UserGroupDTO> children;

    public List<UserDTO> users;

    @JsonIgnoreProperties(value = {"users"})
    public static class WithoutUsers extends UserGroupDTO {
    }

    @JsonIgnoreProperties(value = {"parent", "children"})
    public static class WithoutParentOrChildren extends UserGroupDTO {
    }

    @JsonIgnoreProperties(value = {"parent", "children", "users"})
    public static class WithOnlyName extends UserGroupDTO {
    }

}
