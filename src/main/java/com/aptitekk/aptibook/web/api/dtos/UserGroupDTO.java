/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.dtos;

import java.util.List;

/**
 * DTO for the User Group entity (See {@link com.aptitekk.aptibook.domain.entities.UserGroup})
 */
public class UserGroupDTO {

    public Long id;

    public boolean root;

    public String name;

    /**
     * User Group DTO extension that includes the parent, for listing the hierarchy upwards in relation to a User Group.
     */
    public static class HierarchyUp extends UserGroupDTO {

        public UserGroupDTO.HierarchyUp parent;

    }

    /**
     * User Group DTO extension that includes the children, for listing the hierarchy downwards in relation to a User Group.
     */
    public static class HierarchyDown extends UserGroupDTO {

        public List<UserGroupDTO.HierarchyDown> children;

    }

}
