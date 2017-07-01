/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.web.api.dtos;

import java.util.List;

public class ResourceCategoryDTO {

    public Long id;

    public String name;

    public static class WithResources extends ResourceCategoryDTO {

        public List<ResourceDTO> resources;

    }

}
