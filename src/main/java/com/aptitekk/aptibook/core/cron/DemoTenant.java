/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.cron;

import com.aptitekk.aptibook.core.crypto.PasswordStorage;
import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.repositories.*;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.entity.UserGroupService;
import com.aptitekk.aptibook.core.services.tenant.TenantIntegrityService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DemoTenant {

    private final TenantRepository tenantRepository;

    private final TenantManagementService tenantManagementService;

    private final UserGroupService userGroupService;

    private final UserGroupRepository userGroupRepository;

    private final UserRepository userRepository;

    private final ResourceCategoryRepository resourceCategoryRepository;

    private final ResourceRepository resourceRepository;

    private final TagRepository tagRepository;

    private final PermissionRepository permissionRepository;

    private final ReservationDecisionRepository reservationDecisionRepository;

    private final ReservationRepository reservationRepository;

    private final TenantIntegrityService tenantIntegrityService;

    private final LogService logService;

    @Autowired
    public DemoTenant(TenantRepository tenantRepository, TenantManagementService tenantManagementService, UserGroupService userGroupService, UserGroupRepository userGroupRepository, UserRepository userRepository, ResourceCategoryRepository resourceCategoryRepository, ResourceRepository resourceRepository, TagRepository tagRepository, PermissionRepository permissionRepository, ReservationDecisionRepository reservationDecisionRepository, ReservationRepository reservationRepository, TenantIntegrityService tenantIntegrityService, LogService logService) {
        this.tenantRepository = tenantRepository;
        this.tenantManagementService = tenantManagementService;
        this.userGroupService = userGroupService;
        this.userGroupRepository = userGroupRepository;
        this.userRepository = userRepository;
        this.resourceCategoryRepository = resourceCategoryRepository;
        this.resourceRepository = resourceRepository;
        this.tagRepository = tagRepository;
        this.permissionRepository = permissionRepository;
        this.reservationDecisionRepository = reservationDecisionRepository;
        this.reservationRepository = reservationRepository;
        this.tenantIntegrityService = tenantIntegrityService;
        this.logService = logService;
    }


    /**
     * Deletes and re-builds the demo Tenant every 24 hours.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Async
    public void rebuildDemoTenant() {
        logService.logDebug(getClass(), "Rebuilding Demo Tenant...");

        //Find and delete old demo tenant
        Tenant tenant = tenantRepository.findTenantBySlug("demo");
        if (tenant != null) {
            tenantRepository.delete(tenant);
        }

        //Create new demo tenant
        Tenant newTenant = new Tenant();
        newTenant.setSlug("demo");
        newTenant.setTier(Tenant.Tier.PLATINUM);
        newTenant.setSubscriptionId(-1);
        newTenant.setActive(true);
        newTenant.setAdminEmail(null);
        newTenant = tenantRepository.save(newTenant);
        tenantIntegrityService.initializeNewTenant(newTenant);

        //Add User Groups
        UserGroup administratorsUserGroup = new UserGroup();
        administratorsUserGroup.setName("Administrators");
        administratorsUserGroup.setParent(userGroupRepository.findRootGroup(newTenant));
        administratorsUserGroup.setTenant(newTenant);
        List<Permission> permissionList = new ArrayList<>();
        Permission adminPermission = new Permission();
        adminPermission.setTenant(newTenant);
        adminPermission.setDescriptor(Permission.Descriptor.GENERAL_FULL_PERMISSIONS);
        adminPermission = permissionRepository.save(adminPermission);
        permissionList.add(adminPermission);
        administratorsUserGroup.setPermissions(permissionList);
        administratorsUserGroup = userGroupRepository.save(administratorsUserGroup);


        UserGroup teachersUserGroup = new UserGroup();
        teachersUserGroup.setName("Teachers");
        teachersUserGroup.setParent(administratorsUserGroup);
        teachersUserGroup.setTenant(newTenant);
        List<Permission> permissionList2 = new ArrayList<>();
        Permission teacherPermission = new Permission();
        teacherPermission.setTenant(newTenant);
        teacherPermission.setDescriptor(Permission.Descriptor.GENERAL_FULL_PERMISSIONS);
        teacherPermission = permissionRepository.save(teacherPermission);
        permissionList2.add(teacherPermission);
        teachersUserGroup.setPermissions(permissionList2);
        teachersUserGroup = userGroupRepository.save(teachersUserGroup);

        //Add Users
        User user = new User();
        User user1 = new User();
        try {

            user.setEmailAddress("john_doe@test.com");
            user.setFirstName("John");
            user.setLastName("Doe");
            user.setHashedPassword(PasswordStorage.createHash("test"));
            user.getUserGroups().add(teachersUserGroup);
            user.setTenant(newTenant);
            user = userRepository.save(user);

            user1.setEmailAddress("toby_smith@test.com");
            user1.setFirstName("Toby");
            user1.setLastName("Smith");
            user1.setHashedPassword(PasswordStorage.createHash("test"));
            user1.getUserGroups().add(administratorsUserGroup);
            user1.setTenant(newTenant);
            user1 = userRepository.save(user1);


        } catch (PasswordStorage.CannotPerformOperationException e) {
            logService.logException(getClass(), e, "Could not hash demo user's password");
        }


        //Add Resource Categories
        ResourceCategory resourceCategory = new ResourceCategory();
        resourceCategory.setName("Teacher Laptops");
        resourceCategory.setTenant(newTenant);
        resourceCategory = resourceCategoryRepository.save(resourceCategory);

        //Add Tags
        List<Tag> firstCartList = new ArrayList<>();
        List<Tag> secondCartList = new ArrayList<>();

        Tag adobeTag = new Tag();
        adobeTag.setName("adobe");
        adobeTag.setTenant(newTenant);
        adobeTag.setResourceCategory(resourceCategory);
        adobeTag = tagRepository.save(adobeTag);
        firstCartList.add(adobeTag);


        Tag officeTag = new Tag();
        officeTag.setName("office");
        officeTag.setTenant(newTenant);
        officeTag.setResourceCategory(resourceCategory);
        officeTag = tagRepository.save(officeTag);
        firstCartList.add(officeTag);
        secondCartList.add(officeTag);

        Tag chromebookTag = new Tag();
        chromebookTag.setName("chromebook");
        chromebookTag.setTenant(newTenant);
        chromebookTag.setResourceCategory(resourceCategory);
        chromebookTag = tagRepository.save(chromebookTag);
        firstCartList.add(chromebookTag);

        List<Tag> availableTags = new ArrayList<>();
        availableTags.add(adobeTag);
        availableTags.add(officeTag);
        availableTags.add(chromebookTag);
        resourceCategory.setTags(availableTags);
        resourceCategory = resourceCategoryRepository.save(resourceCategory);


        //Add resources
        Resource cart1 = new Resource();
        cart1.setName("Cart 1");
        cart1.setResourceCategory(resourceCategory);
        cart1.setTenant(newTenant);
        cart1.setTags(firstCartList);
        List<Resource> resourceList = new ArrayList<>();
        resourceList.add(cart1);
        teachersUserGroup.setResources(resourceList);
        cart1 = resourceRepository.save(cart1);

        Resource cart2 = new Resource();
        cart2.setName("Cart 2");
        cart2.setResourceCategory(resourceCategory);
        cart2.setTenant(newTenant);
        cart2.setTags(secondCartList);
        List<Resource> resourceList2 = new ArrayList<>();
        resourceList2.add(cart1);
        administratorsUserGroup.setResources(resourceList2);
        cart2 = resourceRepository.save(cart2);

        //Add reservation
        Reservation reservation = createReservation(
                newTenant,
                user,
                "Sage Testing",
                Reservation.Status.APPROVED,
                cart1,
                5, 6,
                13, 30,
                16, 45);

        Reservation reservation2 = createReservation(
                newTenant,
                user,
                "Essay Research",
                Reservation.Status.PENDING,
                cart2,
                10, 10,
                12, 0,
                15, 30);

        //Set reservation decision
        ReservationDecision reservationDecision = new ReservationDecision();
        reservationDecision.setReservation(reservation);
        reservationDecision.setUserGroup(administratorsUserGroup);
        reservationDecision.setTenant(newTenant);
        reservationDecision.setApproved(true);
        reservationDecision.setUser(user);
        reservationDecision = reservationDecisionRepository.save(reservationDecision);

        ReservationDecision reservationDecision1 = new ReservationDecision();
        reservationDecision1.setReservation(reservation);
        reservationDecision1.setUserGroup(administratorsUserGroup);
        reservationDecision1.setTenant(newTenant);
        reservationDecision1.setApproved(false);
        reservationDecision1.setUser(user);
        reservationDecision1 = reservationDecisionRepository.save(reservationDecision1);

        tenantManagementService.refresh();
    }

    private Reservation createReservation(Tenant tenant,
                                          User user,
                                          String title, Reservation.Status status,
                                          Resource resource,
                                          int startDay, int endDay,
                                          int startHour, int startMinute,
                                          int endHour, int endMinute) {
        Reservation reservation = new Reservation();
        reservation.setTenant(tenant);
        reservation.setUser(user);
        reservation.setTitle(title);
        reservation.setStatus(status);
        reservation.setResource(resource);
        ZonedDateTime start = ZonedDateTime.now(ZoneId.of("America/Denver"))
                .withDayOfMonth(startDay)
                .withHour(startHour)
                .withMinute(startMinute)
                .withSecond(0)
                .withZoneSameInstant(ZoneId.systemDefault());
        ZonedDateTime end = ZonedDateTime.now(ZoneId.of("America/Denver"))
                .withDayOfMonth(endDay)
                .withHour(endHour)
                .withMinute(endMinute)
                .withSecond(0)
                .withZoneSameInstant(ZoneId.systemDefault());
        reservation.setStart(start.toLocalDateTime());
        reservation.setEnd(end.toLocalDateTime());
        return reservationRepository.save(reservation);
    }

}
