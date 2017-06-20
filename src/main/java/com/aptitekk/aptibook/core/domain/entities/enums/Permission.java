/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities.enums;

import java.util.HashSet;
import java.util.Set;

/**
 * Permission for the application.
 */
public class Permission {

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

        private Set<Descriptor> descriptors = new HashSet<>();

        public Set<Descriptor> getDescriptors() {
            return descriptors;
        }
    }

    /**
     * Keys for the individual permissions.
     * NOTE: Any modifications to the NAME of the descriptor (not displayName) will clear its existence from the database!
     */
    public enum Descriptor {

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

        Descriptor(Group group) {
            this.group = group;

            group.descriptors.add(this);
        }

        public Group getGroup() {
            return group;
        }

    }

}
