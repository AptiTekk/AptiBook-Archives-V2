/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities;

import java.util.HashSet;
import java.util.Set;

/**
 * Keys for the individual permissions.
 */
public enum Permission {

    GENERAL_FULL_PERMISSIONS(Group.GENERAL),
    RESOURCE_CATEGORIES_MODIFY_ALL(Group.RESOURCE_CATEGORIES),
    RESOURCES_MODIFY_OWN(Group.RESOURCES),
    RESOURCES_MODIFY_HIERARCHY(Group.RESOURCES),
    RESOURCES_MODIFY_ALL(Group.RESOURCES),
    RESERVATIONS_MODIFY_ALL(Group.RESERVATIONS),
    USERS_MODIFY_ALL(Group.USERS),
    GROUPS_MODIFY_ALL(Group.USER_GROUPS),
    PROPERTIES_MODIFY_ALL(Group.PROPERTIES);

    private final Group group;

    Permission(Group group) {
        this.group = group;

        group.permissions.add(this);
    }

    public Group getGroup() {
        return group;
    }

    /**
     * Defines the groups of permissions.
     */
    public enum Group {

        GENERAL,
        RESOURCE_CATEGORIES,
        RESOURCES,
        RESERVATIONS,
        USERS,
        USER_GROUPS,
        PROPERTIES;

        private Set<Permission> permissions = new HashSet<>();

        public Set<Permission> getPermissions() {
            return permissions;
        }

    }
}
