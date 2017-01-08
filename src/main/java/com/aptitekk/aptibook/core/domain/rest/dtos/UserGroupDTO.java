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

    public boolean root;

    public UserGroupDTO.WithoutChildren parent;

    public List<UserGroupDTO.WithoutParent> children;

    @JsonIgnoreProperties({"parent"})
    public static class WithoutParent extends UserGroupDTO {
    }

    @JsonIgnoreProperties({"children"})
    public static class WithoutChildren extends UserGroupDTO {
    }

    @JsonIgnoreProperties({"parent", "children"})
    public static class WithoutParentOrChildren extends UserGroupDTO {
    }

}
