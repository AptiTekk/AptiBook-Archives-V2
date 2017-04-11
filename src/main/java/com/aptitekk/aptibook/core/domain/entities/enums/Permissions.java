/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities.enums;

import javax.persistence.Column;
import java.util.HashSet;
import java.util.Set;

/**
 * Permissions for the application.
 */
public class Permissions {

    /**
     * Defines the groups of permissions.
     * The order in this enum determines the order shown to the user on the Permissions page.
     */
    public enum Group {

        GENERAL("General"),
        RESOURCE_CATEGORIES("Resource Categories"),
        RESOURCES("Resources"),
        USERS("Users"),
        USER_GROUPS("User Groups"),
        RESERVATIONS("Reservations"),
        PERMISSIONS("Permissions"),
        PROPERTIES("Properties");

        private String displayName;

        private Set<Descriptor> descriptors = new HashSet<>();

        Group(String displayName) {

            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }

        public Set<Descriptor> getDescriptors() {
            return descriptors;
        }
    }
    
    /**
     * Defines the details about the permissions, including their descriptions.
     * The order in this enum determines the order shown to the user within each Group on the Permissions page.
     * <p>
     * NOTE: Any modifications to the NAME of the descriptor (not displayName) will clear its existence from the database!
     */
    public enum Descriptor {

        GENERAL_FULL_PERMISSIONS(Group.GENERAL, "Full Permissions",
                "Users and User Groups with this permission are granted all permissions. They have un-restricted access to AptiBook." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User is granted all permissions.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group are granted all permissions.</li>" +
                        "</ul>"),

        RESOURCE_CATEGORIES_MODIFY_ALL(Group.RESOURCE_CATEGORIES, "May Modify Any Resource Categories",
                "Users and User Groups with this permission may create, edit, and delete any Resource Categories." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may create, edit, and delete any Resource Categories.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Resource Categories.</li>" +
                        "</ul>"),

        RESOURCES_MODIFY_OWN(Group.RESOURCES, "May Modify Own Group's Resources",
                "Users and User Groups with this permission may create, edit, and delete Resources for their User Group." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may create, edit, and delete Resources for the User Groups that the User is assigned to.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete Resources for their User Group.</li>" +
                        "</ul>"),

        RESOURCES_MODIFY_HIERARCHY(Group.RESOURCES, "May Modify Hierarchy's Resources",
                "Users and User Groups with this permission may create, edit, and delete Resources for their User Group and that User Group's children." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may create, edit, and delete Resources for the User Groups that the User is assigned to, and those User Groups' children.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete Resources for their User Group and that User Group's children.</li>" +
                        "</ul>"),

        RESOURCES_MODIFY_ALL(Group.RESOURCES, "May Modify Any Resources",
                "Users and User Groups with this permission may create, edit, and delete any Resources." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may create, edit, and delete any Resources.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Resources.</li>" +
                        "</ul>"),

        RESERVATIONS_MODIFY_ALL(Group.RESERVATIONS, "May Modify All Reservations",
                "Users and User Groups with this permission may edit and cancel any Reservations." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may edit and cancel any Reservations.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may edit and cancel any Reservations.</li>" +
                        "</ul>"),

        USERS_MODIFY_ALL(Group.USERS, "May Modify Any Users",
                "Users and User Groups with this permission may create, edit, and delete any Users." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may create, edit, and delete any Users.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any Users.</li>" +
                        "</ul>"),

        GROUPS_MODIFY_ALL(Group.USER_GROUPS, "May Modify Any User Groups",
                "Users and User Groups with this permission may create, edit, and delete any User Groups." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may create, edit, and delete any User Groups.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may create, edit, and delete any User Groups.</li>" +
                        "</ul>"),

        PERMISSIONS_MODIFY_ALL(Group.PERMISSIONS, "May Assign Any Permissions",
                "Users and User Groups with this permission may assign any Permissions." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may assign any Permissions.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may assign any Permissions.</li>" +
                        "</ul>"),

        PROPERTIES_MODIFY_ALL(Group.PROPERTIES, "May Modify Any Properties",
                "Users and User Groups with this permission may edit any Properties." +
                        "<ul>" +
                        "<li>If a User is given this permission, the User may edit any Properties.</li>" +
                        "<li>If a User Group is given this permission, any Users within the User Group may edit any Properties.</li>" +
                        "</ul>");

        private final Group group;
        private final String displayName;
        private final String description;

        Descriptor(Group group, String displayName, String description) {
            this.group = group;
            this.displayName = displayName;
            this.description = description;

            group.descriptors.add(this);
        }

        public Group getGroup() {
            return group;
        }

        public String getDisplayName() {
            return displayName;
        }

        public String getDescription() {
            return description;
        }

    }

}
