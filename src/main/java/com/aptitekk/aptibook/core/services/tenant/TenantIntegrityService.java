/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.tenant;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.repositories.*;
import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.core.services.SpringProfileService;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TenantIntegrityService {

    private final UserGroupRepository userGroupRepository;

    private final UserRepository userRepository;

    private final ResourceCategoryRepository resourceCategoryRepository;

    private final PropertiesRepository propertiesRepository;

    private final PermissionRepository permissionRepository;

    private final EmailService emailService;

    private final SpringProfileService springProfileService;

    @Autowired
    public TenantIntegrityService(UserGroupRepository userGroupRepository, UserRepository userRepository, ResourceCategoryRepository resourceCategoryRepository, PropertiesRepository propertiesRepository, PermissionRepository permissionRepository, EmailService emailService, SpringProfileService springProfileService) {
        this.userGroupRepository = userGroupRepository;
        this.userRepository = userRepository;
        this.resourceCategoryRepository = resourceCategoryRepository;
        this.propertiesRepository = propertiesRepository;
        this.permissionRepository = permissionRepository;
        this.emailService = emailService;
        this.springProfileService = springProfileService;
    }

    public void initializeNewTenant(Tenant tenant) {
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
        if (userGroupRepository.findRootGroup(tenant) == null) {
            UserGroup rootGroup = new UserGroup(UserGroupRepository.ROOT_GROUP_NAME);
            rootGroup.setTenant(tenant);
            try {
                userGroupRepository.save(rootGroup);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void checkForAdminUser(Tenant tenant) {
        User adminUser = userRepository.findByEmailAddress(UserRepository.ADMIN_EMAIL_ADDRESS, tenant);
        if (adminUser == null) {

            try {
                adminUser = new User();
                adminUser.setEmailAddress(UserRepository.ADMIN_EMAIL_ADDRESS);

                if (springProfileService.isProfileActive(SpringProfileService.Profile.PRODUCTION)) {
                    String password = PasswordGenerator.generateRandomPassword(10);
                    adminUser.hashedPassword = PasswordStorage.createHash(password);
                    emailService.sendEmailNotification(tenant.getAdminEmail(), "AptiBook Registration", "<p>Thank you for registering with AptiBook! We are very excited to hear about how you and your team uses AptiBook.</p>"
                            + "<p>You can sign in to AptiBook using the URL and credentials below. Once you sign in, you can change your password by clicking <b>admin</b> on the navigation bar and visiting <b>My Account</b>.<br>"
                            + "https://aptibook.aptitekk.com/" + tenant.getSlug() + "</p>"
                            + "<center>"
                            + "Username: <b>admin</b> <br>"
                            + "Password: <b>" + password + "</b>"
                            + "</center>"
                            + "<p>Please let us know of any way we can be of assistance, and be sure to check out our knowledge base at https://support.aptitekk.com/. Enjoy!</p>");
                } else {
                    adminUser.hashedPassword = PasswordStorage.createHash("admin");
                }
                adminUser.verified = true;
                adminUser.userState = User.State.APPROVED;
                adminUser.setTenant(tenant);

                try {
                    userRepository.save(adminUser);
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
        User adminUser = userRepository.findByEmailAddress(UserRepository.ADMIN_EMAIL_ADDRESS, tenant);
        if (adminUser != null) {
            UserGroup rootGroup = userGroupRepository.findRootGroup(tenant);
            if (rootGroup != null) {
                if (!adminUser.userGroups.contains(rootGroup)) {
                    try {
                        adminUser.userGroups.add(rootGroup);
                        userRepository.save(adminUser);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private void writeDefaultProperties(Tenant tenant) {
        Iterable<Property> currentProperties = propertiesRepository.findAllForTenant(tenant);

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
                    propertiesRepository.save(property);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private void writeDefaultPermissions(Tenant tenant) {
        Iterable<Permission> currentPermissions = permissionRepository.findAllForTenant(tenant);

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
                    permissionRepository.save(permission);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private void addDefaultResourceCategories(Tenant tenant) {
        if (resourceCategoryRepository.findAllForTenant(tenant).isEmpty()) {
            try {
                ResourceCategory resourceCategory = new ResourceCategory("Rooms");
                resourceCategory.setTenant(tenant);
                resourceCategoryRepository.save(resourceCategory);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
