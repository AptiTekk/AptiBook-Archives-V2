/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.PersistenceException;
import java.util.List;
import java.util.Set;

@EntityRepository
public class UserGroupRepository extends MultiTenantEntityRepositoryAbstract<UserGroup> {

    public static final String ROOT_GROUP_NAME = "root";

    @Override
    public void delete(UserGroup userGroup) {
        if (userGroup != null) {
            //Remove user assignments
            for (User user : userGroup.getUsers()) {
                user.userGroups.remove(userGroup);
            }
        }

        super.delete(userGroup);
    }

    /**
     * Finds Group Entity by its name, within the current Tenant.
     *
     * @param userGroupName The name of the group to search for.
     * @return A User Group with the specified name, or null if one does not exist.
     */
    public UserGroup findByName(String userGroupName) {
        return findByName(userGroupName, getTenant());
    }

    /**
     * Finds Group Entity by its name, within the specified Tenant.
     * <p>
     * The search is case-insensitive.
     *
     * @param userGroupName The name of the group to search for.
     * @param tenant        The Tenant of the User Group to search for.
     * @return A User Group with the specified name, or null if one does not exist.
     */
    public UserGroup findByName(String userGroupName, Tenant tenant) {
        if (userGroupName == null || tenant == null)
            return null;

        try {
            return entityManager
                    .createQuery("SELECT g FROM UserGroup g WHERE LOWER(g.name) = :name AND g.tenant = :tenant", UserGroup.class)
                    .setParameter("name", userGroupName.toLowerCase())
                    .setParameter("tenant", tenant)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

    /**
     * @return The Root UserGroup of the current Tenant.
     */
    public UserGroup findRootGroup() {
        return findRootGroup(getTenant());
    }

    /**
     * @return The Root UserGroup of the specified Tenant.
     */
    public UserGroup findRootGroup(Tenant tenant) {
        return findByName(ROOT_GROUP_NAME, tenant);
    }

}
