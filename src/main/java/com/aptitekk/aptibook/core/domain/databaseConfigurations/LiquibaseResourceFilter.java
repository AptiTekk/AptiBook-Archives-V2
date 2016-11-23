/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.databaseConfigurations;

import liquibase.changelog.IncludeAllFilter;

public class LiquibaseResourceFilter implements IncludeAllFilter {
    @Override
    public boolean include(String changeLogPath) {
        String[] splitPath = changeLogPath.split("/");
        String fileName = splitPath.length > 0 ? splitPath[splitPath.length - 1] : null;
        return fileName != null && fileName.matches("\\d+__.+\\.xml");
    }
}
