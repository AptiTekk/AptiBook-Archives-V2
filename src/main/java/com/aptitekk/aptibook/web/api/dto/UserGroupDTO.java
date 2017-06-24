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
