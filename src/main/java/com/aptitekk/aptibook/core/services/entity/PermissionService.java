/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.Permission;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.services.annotations.EntityService;

@EntityService
public class PermissionService {

    /**
     * Determines if the User has the permission supplied.
     * Will take into account the User Groups that the User is part of.
     *
     * @param user       The User to check.
     * @param descriptor The Permission Descriptor to look for.
     * @return true if the User has the Permission, false otherwise.
     */
    public boolean userHasPermission(User user, Permission.Descriptor descriptor) {
        if (user == null || descriptor == null)
            return false;

        for (Permission permission : user.permissions) {
            if (permission.getDescriptor() == descriptor)
                return true;
        }

        for (UserGroup userGroup : user.userGroups) {
            for (Permission permission : userGroup.getPermissions()) {
                if (permission.getDescriptor() == descriptor)
                    return true;
            }
        }

        return false;
    }

    /**
     * Determines if the User has any permissions within the specified Permission Group.
     *
     * @param user  The User to check.
     * @param group The Permission Group that one or more of the User's Permissions should belong to.
     * @return true if the User has a Permission in the Group, false otherwise.
     */
    public boolean userHasPermissionOfGroup(User user, Permission.Group group) {
        if (user == null || group == null)
            return false;

        for (Permission permission : user.permissions) {
            if (permission.getDescriptor().getGroup() == group)
                return true;
        }

        for (UserGroup userGroup : user.userGroups) {
            for (Permission permission : userGroup.getPermissions()) {
                if (permission.getDescriptor().getGroup() == group)
                    return true;
            }
        }

        return false;
    }

}
