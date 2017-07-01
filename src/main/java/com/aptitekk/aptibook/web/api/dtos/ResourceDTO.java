/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.dtos;

public class ResourceDTO {

    public Long id;

    public String name;

    public Boolean needsApproval;

    public Boolean hasImage;

    public UserGroupDTO owner;

    public static class WithResourceCategory extends ResourceDTO {

        public ResourceCategoryDTO resourceCategory;

    }

}
