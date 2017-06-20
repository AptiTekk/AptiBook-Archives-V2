/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.services.annotations.EntityService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@EntityService
public class PermissionsService {

    private final UserGroupService userGroupService;
    private final UserGroupRepository userGroupRepository;
    private final UserRepository userRepository;

    @Autowired
    public PermissionsService(UserGroupService userGroupService,
                              UserGroupRepository userGroupRepository,
                              UserRepository userRepository) {
        this.userGroupService = userGroupService;
        this.userGroupRepository = userGroupRepository;
        this.userRepository = userRepository;
    }

    /**
     * Finds all the User Groups assigned to a Permission.
     *
     * @param descriptor The Permission's Descriptor.
     * @return A List of User Groups assigned to the Permission.
     */
    public List<UserGroup> getUserGroupsAssignedToPermission(Permission.Descriptor descriptor) {
        // Get all the User Groups.
        List<UserGroup> allUserGroups = this.userGroupRepository.findAll();

        // Include only the User Groups which have the permission.
        return allUserGroups.stream().filter(userGroup -> userGroup.getPermissions().contains(descriptor)).collect(Collectors.toList());
    }

    /**
     * Finds all the Users assigned to a Permission.
     *
     * @param descriptor The Permission's Descriptor.
     * @param inherited  Whether or not to include inherited assignments, from the Users' User Groups.
     * @return A List of Users assigned to the Permission.
     */
    public List<User> getUsersAssignedToPermission(Permission.Descriptor descriptor,
                                                   boolean inherited) {
        // Get all the Users.
        List<User> allUsers = this.userRepository.findAll();

        // Include only the Users which have the permission.
        return allUsers.stream().filter(user -> {
            // Check if the user has the permission explicitly assigned to them.
            boolean hasPermission = user.getPermissions().contains(descriptor);

            // If we are checking for inheritance and the user does not explicitly have the permission, check their groups.
            if (inherited && !hasPermission)
                hasPermission = user.getUserGroups().stream().anyMatch(userGroup -> userGroup.getPermissions().contains(descriptor));

            return hasPermission;
        }).collect(Collectors.toList());
    }

    /**
     * Determines if the User has the permission supplied.
     * Will take into account the User Groups that the User is part of.
     * <p>
     * A user with Full Permission will return true for all permissions.
     *
     * @param user       The User to check.
     * @param descriptor The Permission Descriptor to look for.
     * @return true if the User has the Permission, false otherwise.
     */
    public boolean userHasPermission(User user, Permission.Descriptor descriptor) {
        if (user == null || descriptor == null)
            return false;

        // The admin has all permissions.
        if (user.isAdmin())
            return true;

        // Check for full permissions.
        if (user.getPermissions().contains(Permission.Descriptor.GENERAL_FULL_PERMISSIONS))
            return true;

        // Check for the specific descriptor.
        if (user.getPermissions().contains(descriptor))
            return true;

        // Check if the User inherits permissions from their groups.
        for (UserGroup userGroup : user.getUserGroups()) {

            // Check for full permissions.
            if (userGroup.getPermissions().contains(Permission.Descriptor.GENERAL_FULL_PERMISSIONS))
                return true;

            // Check for the specific descriptor.
            if (userGroup.getPermissions().contains(descriptor))
                return true;
        }

        return false;
    }

    /**
     * Determines if the User has any permissions within the specified Permission Group.
     * <p>
     * A user with Full Permission will return true for all permissions.
     *
     * @param user  The User to check.
     * @param group The Permission Group that one or more of the User's Permission should belong to.
     * @return true if the User has a Permission in the Group, false otherwise.
     */
    public boolean userHasPermissionOfGroup(User user, Permission.Group group) {
        if (user == null || group == null)
            return false;

        // The admin has all permissions.
        if (user.isAdmin())
            return true;

        // Check for full permissions.
        if (user.getPermissions().contains(Permission.Descriptor.GENERAL_FULL_PERMISSIONS))
            return true;

        // Check if the User has any permissions from the group.
        for (Permission.Descriptor permissionDescriptor : group.getDescriptors())
            if (user.getPermissions().contains(permissionDescriptor))
                return true;

        // Check if the User inherits permissions from their groups.
        for (UserGroup userGroup : user.getUserGroups()) {

            // Check for full permissions.
            if (userGroup.getPermissions().contains(Permission.Descriptor.GENERAL_FULL_PERMISSIONS))
                return true;

            // Check if the UserGroup has any permissions from the group.
            for (Permission.Descriptor permissionDescriptor : group.getDescriptors())
                if (userGroup.getPermissions().contains(permissionDescriptor))
                    return true;
        }

        return false;
    }

    /**
     * Gets the total Permission for a User, including those inherited from User Groups.
     *
     * @param user The User.
     * @return A Set containing all the User's inherited and non-inherited Permission.
     */
    public Set<Permission.Descriptor> getAllPermissionsForUser(User user) {
        Set<Permission.Descriptor> permissions = new HashSet<>();
        permissions.addAll(user.getPermissions());

        for (UserGroup userGroup : user.getUserGroups()) {
            permissions.addAll(userGroup.getPermissions());
        }

        return permissions;
    }

    /**
     * Determines if the User can edit the specified Resource.
     *
     * @param resource The resource to be edited.
     * @param user     The user that is editing.
     * @return True if the user can edit, false otherwise.
     */
    public boolean canUserEditResource(Resource resource, User user) {
        // True if they can edit all resources
        if (this.userHasPermission(user, Permission.Descriptor.RESOURCES_MODIFY_ALL))
            return true;

        // False if they have no other resource permissions
        if (!this.userHasPermission(user, Permission.Descriptor.RESOURCES_MODIFY_OWN)
                && !this.userHasPermission(user, Permission.Descriptor.RESOURCES_MODIFY_HIERARCHY))
            return false;

        // Check every group the user belongs to.
        for (UserGroup userGroup : user.getUserGroups()) {

            // True if the User belongs to the User Group that owns the resource.
            if (resource.getOwner().equals(userGroup))
                return true;

            // Check every group below the user's own if they have permission.
            if (this.userHasPermission(user, Permission.Descriptor.RESOURCES_MODIFY_HIERARCHY))

                for (UserGroup hierarchyGroup : userGroupService.getHierarchyDown(userGroup))

                    // True if the User has hierarchy over the User Group that owns the resource.
                    if (resource.getOwner().equals(hierarchyGroup))
                        return true;

        }

        // False otherwise.
        return false;
    }

}
