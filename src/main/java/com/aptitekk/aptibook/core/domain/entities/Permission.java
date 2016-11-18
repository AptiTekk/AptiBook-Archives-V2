/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.util.EqualsHelper;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Entity
public class Permission extends MultiTenantEntity implements Serializable {

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

        private String friendlyName;

        Group(String friendlyName) {

            this.friendlyName = friendlyName;
        }

        public String getFriendlyName() {
            return friendlyName;
        }

    }

    /**
     * Defines the details about the permissions, including their descriptions.
     * The order in this enum determines the order shown to the user within each Group on the Permissions page.
     * <p>
     * NOTE: Any modifications to the NAME of the descriptor (not friendlyName) will clear its existence from the database!
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
        private final String friendlyName;
        private final String description;

        Descriptor(Group group, String friendlyName, String description) {
            this.group = group;
            this.friendlyName = friendlyName;
            this.description = description;
        }

        public Group getGroup() {
            return group;
        }

        public String getFriendlyName() {
            return friendlyName;
        }

        public String getDescription() {
            return description;
        }

    }

    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(value = EnumType.STRING)
    private Descriptor descriptor;

    @ManyToMany(mappedBy = "permissions")
    private Set<UserGroup> userGroups;

    @ManyToMany(mappedBy = "permissions")
    private Set<User> users;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Descriptor getDescriptor() {
        return descriptor;
    }

    public void setDescriptor(Descriptor descriptor) {
        this.descriptor = descriptor;
    }

    public Set<UserGroup> getUserGroups() {
        return userGroups;
    }

    public void setUserGroups(Set<UserGroup> userGroups) {
        this.userGroups = userGroups;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Permission)) return false;

        Permission other = (Permission) o;

        return EqualsHelper.areEquals(getDescriptor(), other.getDescriptor());
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(getDescriptor());
    }
}
