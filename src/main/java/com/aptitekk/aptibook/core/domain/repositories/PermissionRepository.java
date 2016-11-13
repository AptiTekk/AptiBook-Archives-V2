/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.PersistenceException;
import java.util.List;

@EntityRepository
public class PermissionRepository extends MultiTenantEntityRepositoryAbstract<Permission> {

    public List<Permission> findAllJoinUsersAndGroups() {
        try {
            List<Permission> permissionsUsers = entityManager
                    .createQuery("SELECT p FROM Permission p LEFT JOIN FETCH p.users WHERE p.tenant = ?1", Permission.class)
                    .setParameter(1, getTenant())
                    .getResultList();

            List<Permission> permissionsUserGroups = entityManager
                    .createQuery("SELECT p FROM Permission p LEFT JOIN FETCH p.userGroups WHERE p.tenant = ?1", Permission.class)
                    .setParameter(1, getTenant())
                    .getResultList();

            for (Permission permission : permissionsUserGroups) {
                if (permissionsUsers.contains(permission))
                    permissionsUsers.get(permissionsUsers.indexOf(permission)).setUserGroups(permission.getUserGroups());
            }
            return permissionsUsers;
        } catch (PersistenceException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Gets the Permission Entity that matches the Permission Descriptor, within the current Tenant.
     *
     * @param descriptor The Permission Descriptor.
     * @return the Permission Entity if found, null otherwise.
     */
    public Permission findPermissionByDescriptor(Permission.Descriptor descriptor) {
        return findPermissionByDescriptor(descriptor, getTenant());
    }

    /**
     * Gets the Permission Entity that matches the Permission Descriptor, within the specified Tenant.
     *
     * @param descriptor The Permission Descriptor.
     * @param tenant     The Tenant of the Permission being searched for.
     * @return the Permission Entity if found, null otherwise.
     */
    public Permission findPermissionByDescriptor(Permission.Descriptor descriptor, Tenant tenant) {
        if (descriptor == null || tenant == null)
            return null;

        try {
            return entityManager
                    .createQuery("SELECT p FROM Permission p WHERE p.descriptor = :descriptor AND p.tenant = :tenant", Permission.class)
                    .setParameter("descriptor", descriptor)
                    .setParameter("tenant", tenant)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

}
