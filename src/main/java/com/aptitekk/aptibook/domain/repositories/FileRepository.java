/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.repositories;

import com.aptitekk.aptibook.domain.entities.File;
import com.aptitekk.aptibook.domain.repositories.annotations.EntityRepository;

@EntityRepository
public class FileRepository extends MultiTenantEntityRepositoryAbstract<File> {
}
