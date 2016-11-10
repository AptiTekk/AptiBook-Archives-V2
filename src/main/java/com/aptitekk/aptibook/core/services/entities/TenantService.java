/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entities;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.services.SpringProfileService;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.persistence.PersistenceException;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class TenantService extends GlobalEntityServiceAbstract<Tenant> {

    @Autowired
    private UserGroupService userGroupService;

    @Autowired
    private UserService userService;

    @Autowired
    private ResourceCategoryService resourceCategoryService;

    @Autowired
    private PropertiesService propertiesService;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SpringProfileService springProfileService;

    public Tenant getTenantBySubscriptionId(int subscriptionId) {
        try {
            return entityManager
                    .createQuery("SELECT t FROM Tenant t WHERE t.subscriptionId = ?1", Tenant.class)
                    .setParameter(1, subscriptionId)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

    public Tenant getTenantBySlug(String slug) {
        try {
            return entityManager
                    .createQuery("SELECT t FROM Tenant t WHERE t.slug = ?1", Tenant.class)
                    .setParameter(1, slug)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

    @Override
    public Tenant save(Tenant entity) {
        entity = super.save(entity);

        initializeNewTenant(entity);
        return entity;
    }

    private void initializeNewTenant(Tenant tenant) {
        ensureTenantIntegrity(tenant);
        addDefaultResourceCategories(tenant);
    }

    public void ensureTenantIntegrity(Tenant tenant) {
        checkForRootGroup(tenant);
        checkForAdminUser(tenant);
        writeDefaultProperties(tenant);
        writeDefaultPermissions(tenant);
    }

    private void checkForRootGroup(Tenant tenant) {
        if (userGroupService.getRootGroup(tenant) == null) {
            UserGroup rootGroup = new UserGroup(UserGroupService.ROOT_GROUP_NAME);
            rootGroup.setTenant(tenant);
            try {
                userGroupService.save(rootGroup);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void checkForAdminUser(Tenant tenant) {
        User adminUser = userService.findByEmailAddress(UserService.ADMIN_EMAIL_ADDRESS, tenant);
        if (adminUser == null) {

            try {
                adminUser = new User();
                adminUser.setEmailAddress(UserService.ADMIN_EMAIL_ADDRESS);

                if (springProfileService.isProfileActive(SpringProfileService.Profile.PRODUCTION)) {
                    String password = PasswordGenerator.generateRandomPassword(10);
                    adminUser.setHashedPassword(PasswordStorage.createHash(password));
                    emailService.sendEmailNotification(tenant.getAdminEmail(), "AptiBook Registration", "<p>Thank you for registering with AptiBook! We are very excited to hear about how you and your team uses AptiBook.</p>"
                            + "<p>You can sign in to AptiBook using the URL and credentials below. Once you sign in, you can change your password by clicking <b>admin</b> on the navigation bar and visiting <b>My Account</b>.<br>"
                            + "https://aptibook.aptitekk.com/" + tenant.getSlug() + "</p>"
                            + "<center>"
                            + "Username: <b>admin</b> <br>"
                            + "Password: <b>" + password + "</b>"
                            + "</center>"
                            + "<p>Please let us know of any way we can be of assistance, and be sure to check out our knowledge base at https://support.aptitekk.com/. Enjoy!</p>");
                } else {
                    adminUser.setHashedPassword(PasswordStorage.createHash("admin"));
                }
                adminUser.setVerified(true);
                adminUser.setUserState(User.State.APPROVED);
                adminUser.setTenant(tenant);

                try {
                    userService.save(adminUser);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } catch (PasswordStorage.CannotPerformOperationException e) {
                e.printStackTrace();
            }
        }
        ensureAdminHasRootGroup(tenant);
    }

    private void ensureAdminHasRootGroup(Tenant tenant) {
        User adminUser = userService.findByEmailAddress(UserService.ADMIN_EMAIL_ADDRESS, tenant);
        if (adminUser != null) {
            UserGroup rootGroup = userGroupService.getRootGroup(tenant);
            if (rootGroup != null) {
                if (!adminUser.getUserGroups().contains(rootGroup)) {
                    try {
                        adminUser.getUserGroups().add(rootGroup);
                        userService.save(adminUser);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private void writeDefaultProperties(Tenant tenant) {
        Iterable<Property> currentProperties = propertiesService.findAllForTenant(tenant);

        for (Property.Key key : Property.Key.values()) {
            boolean foundProperty = false;

            for (Property property : currentProperties) {
                if (property.getPropertyKey().equals(key)) {
                    foundProperty = true;
                    break;
                }
            }

            if (!foundProperty) {
                Property property = new Property();
                property.setPropertyKey(key);
                property.setPropertyValue(key.getDefaultValue());
                property.setTenant(tenant);
                try {
                    propertiesService.save(property);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private void writeDefaultPermissions(Tenant tenant) {
        Iterable<Permission> currentPermissions = permissionService.findAllForTenant(tenant);

        for (Permission.Descriptor descriptor : Permission.Descriptor.values()) {
            boolean foundPermission = false;

            for (Permission permission : currentPermissions) {
                if (permission.getDescriptor().equals(descriptor)) {
                    foundPermission = true;
                    break;
                }
            }

            if (!foundPermission) {
                Permission permission = new Permission();
                permission.setDescriptor(descriptor);
                permission.setTenant(tenant);
                try {
                    permissionService.save(permission);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private void addDefaultResourceCategories(Tenant tenant) {
        if (resourceCategoryService.findAllForTenant(tenant).isEmpty()) {
            try {
                ResourceCategory resourceCategory = new ResourceCategory("Rooms");
                resourceCategory.setTenant(tenant);
                resourceCategoryService.save(resourceCategory);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
