/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services.entity;

import com.aptitekk.aptibook.core.domain.entities.Reservation;
import com.aptitekk.aptibook.core.domain.entities.Resource;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.services.annotations.EntityService;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@EntityService
public class UserGroupService {

    /**
     * Returns a list containing all usergroups above and including the usergroup passed in.
     * The list is in no specific order.
     *
     * @param origin The origin usergroup, from which the tree shall be traversed up.
     */
    public List<UserGroup> getHierarchyUp(UserGroup origin) {
        List<UserGroup> hierarchy = new ArrayList<>();
        hierarchy.add(origin);

        UserGroup currentGroup = origin;
        UserGroup parentGroup;
        while ((parentGroup = currentGroup.parent) != null) {
            hierarchy.add(parentGroup);
            currentGroup = parentGroup;
        }

        return hierarchy;
    }

    /**
     * Returns a list containing all usergroups below and including the usergroup passed in.
     * The list is in no specific order.
     *
     * @param origin The origin usergroup, from which the tree shall be traversed down.
     */
    public List<UserGroup> getHierarchyDown(UserGroup origin) {
        Queue<UserGroup> queue = new LinkedList<>();
        queue.add(origin);
        UserGroup currEntry;
        List<UserGroup> groups = new ArrayList<>();
        while ((currEntry = queue.poll()) != null) {
            groups.add(currEntry);
            for (UserGroup child : currEntry.children) {
                queue.add(child);
            }
        }
        return groups;
    }

    /**
     * Returns a list containing all resources below and including those belonging to the usergroup passed in.
     * The list is in no specific order.
     *
     * @param origin The origin usergroup, from which the tree shall be traversed down.
     */
    public List<Resource> getHierarchyDownResources(UserGroup origin) {
        List<UserGroup> userGroups = getHierarchyDown(origin);
        List<Resource> userGroupResources = new ArrayList<>();
        for (UserGroup userGroup : userGroups) {
            userGroupResources.addAll(userGroup.resources);
        }
        return userGroupResources;
    }

    /**
     * Returns a list containing all reservations below and including those belonging to the resources of the usergroup passed in.
     * The list is in no specific order.
     *
     * @param origin The origin usergroup, from which the tree shall be traversed down.
     */
    public List<Reservation> getHierarchyDownReservations(UserGroup origin) {
        List<Reservation> resourceReservations = new ArrayList<>();
        for (Resource resource : getHierarchyDownResources(origin)) {
            resourceReservations.addAll(resource.reservations);
        }
        return resourceReservations;
    }

}
