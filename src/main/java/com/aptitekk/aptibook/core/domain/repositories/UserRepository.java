/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.PersistenceException;
import java.util.List;

@EntityRepository
public class UserRepository extends MultiTenantEntityRepositoryAbstract<User> {

    /**
     * Finds the admin user for the current Tenant.
     *
     * @return The admin user, or null if one could not be found.
     */
    public User findAdminUser() {
        try {
            return entityManager
                    .createQuery("SELECT u FROM User u WHERE u.tenant = ?1 AND u.admin = TRUE", User.class)
                    .setParameter(1, getTenant())
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Finds User Entity by its verification code, within all tenants.
     *
     * @param verificationCode The verification code of the User to search for.
     * @return A User Entity with the specified registration code, or null if one does not exist.
     */
    public User findByVerificationCode(String verificationCode) {
        if (verificationCode == null) {
            return null;
        }
        try {
            return entityManager
                    .createQuery("SELECT u FROM User u WHERE u.verificationCode = :verificationCode", User.class)
                    .setParameter("verificationCode", verificationCode)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

    /**
     * Finds User Entity by its email address, within the current Tenant.
     *
     * @param emailAddress The email address of the User to search for.
     * @return A User Entity with the specified email address, or null if one does not exist.
     */
    public User findByEmailAddress(String emailAddress) {
        return findByEmailAddress(emailAddress, getTenant());
    }

    /**
     * Finds User Entity by its email address, within the specified Tenant.
     * <p>
     * The search is case-insensitive.
     *
     * @param emailAddress The email address of the User to search for.
     * @param tenant       The Tenant of the User to search for.
     * @return A User Entity with the specified email address, or null if one does not exist.
     */
    public User findByEmailAddress(String emailAddress, Tenant tenant) {
        if (emailAddress == null || tenant == null) {
            return null;
        }
        try {
            return entityManager
                    .createQuery("SELECT u FROM User u WHERE LOWER(u.emailAddress) = :emailAddress AND u.tenant = :tenant", User.class)
                    .setParameter("emailAddress", emailAddress.toLowerCase())
                    .setParameter("tenant", tenant)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

    /**
     * Finds User Entity by its CAS ID, within the current Tenant.
     * The search is case-sensitive.
     *
     * @param casId  The CAS ID of the User to search for.
     * @return A User Entity with the specified CAS ID, or null if one does not exist.
     */
    public User findByCASID(String casId) {
        if (casId == null || getTenant() == null) {
            return null;
        }
        try {
            return entityManager
                    .createQuery("SELECT u FROM User u WHERE u.casId = :casId AND u.tenant = :tenant", User.class)
                    .setParameter("casId", casId)
                    .setParameter("tenant", getTenant())
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

    /**
     * Finds and returns a list of all users with the given permission. Also includes all users with full permissions, and admin, as they inherit all permissions.
     *
     * @param descriptor The permission to filter users by.
     * @return A list of users with either the given permission or full permissions. Includes admin.
     */
    public List<User> findUsersWithPermission(Permission.Descriptor descriptor) {
        try {
            List<User> usersWithPermission = entityManager
                    .createQuery("SELECT u from User u WHERE (?1 MEMBER OF u.permissions OR ?2 MEMBER OF u.permissions) AND u.tenant = ?3", User.class)
                    .setParameter(1, descriptor)
                    .setParameter(2, Permission.Descriptor.GENERAL_FULL_PERMISSIONS)
                    .setParameter(3, getTenant())
                    .getResultList();

            List<UserGroup> groupsWithPermission = entityManager
                    .createQuery("SELECT g FROM UserGroup g WHERE (?1 MEMBER OF g.permissions OR ?2 MEMBER OF g.permissions)  AND g.tenant = ?3", UserGroup.class)
                    .setParameter(1, descriptor)
                    .setParameter(2, Permission.Descriptor.GENERAL_FULL_PERMISSIONS)
                    .setParameter(3, getTenant())
                    .getResultList();

            for (UserGroup userGroup : groupsWithPermission) {
                for (User user : userGroup.getUsers()) {
                    if (!usersWithPermission.contains(user))
                        usersWithPermission.add(user);
                }
            }

            usersWithPermission.add(findAdminUser());
            return usersWithPermission;

        } catch (Exception e) {
            return null;
        }
    }

}
