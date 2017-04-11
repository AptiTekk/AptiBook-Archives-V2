/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.PersistenceException;
import java.util.List;
import java.util.Set;

@EntityRepository
public class UserRepository extends MultiTenantEntityRepositoryAbstract<User> {



    public static final String ADMIN_EMAIL_ADDRESS = "admin";

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
     * Determines if the credentials are correct or not for the current Tenant.
     *
     * @param emailAddress The email address of the user to check.
     * @param password     The password of the user to check (raw).
     * @return The User if the credentials are correct, or null if they are not.
     */
    public User findUserWithCredentials(String emailAddress, String password) {
        if (emailAddress == null || password == null || getTenant() == null) {
            return null;
        }

        try {
            User user = entityManager
                    .createQuery("SELECT u FROM User u WHERE LOWER(u.emailAddress) = :emailAddress AND u.tenant = :tenant", User.class)
                    .setParameter("emailAddress", emailAddress.toLowerCase())
                    .setParameter("tenant", getTenant())
                    .getSingleResult();
            if (user != null && user.hashedPassword != null) {
                if (PasswordStorage.verifyPassword(password, user.hashedPassword))
                    return user;
            }
        } catch (PersistenceException | PasswordStorage.CannotPerformOperationException | PasswordStorage.InvalidHashException e) {
            return null;
        }
        return null;
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
                    .createQuery("SELECT distinct u from User u LEFT JOIN fetch u.permissions p WHERE (p.descriptor = ?1 OR p.descriptor = ?2) AND u.tenant = ?3", User.class)
                    .setParameter(1, descriptor)
                    .setParameter(2, Permission.Descriptor.GENERAL_FULL_PERMISSIONS)
                    .setParameter(3, getTenant())
                    .getResultList();

            List<UserGroup> groupsWithPermission = entityManager
                    .createQuery("SELECT distinct g FROM UserGroup g LEFT JOIN fetch g.permissions p WHERE (p.descriptor = ?1 OR p.descriptor = ?2) AND g.tenant = ?3", UserGroup.class)
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

            usersWithPermission.add(findByEmailAddress(ADMIN_EMAIL_ADDRESS));
            return usersWithPermission;

        } catch (Exception e) {
            return null;
        }
    }

}
