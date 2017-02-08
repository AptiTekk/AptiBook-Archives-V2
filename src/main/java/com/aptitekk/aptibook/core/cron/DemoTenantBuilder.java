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
import com.aptitekk.aptibook.core.services.tenant.TenantIntegrityService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

@Service
public class DemoTenantBuilder {

    private Tenant demoTenant;

    private final TenantRepository tenantRepository;

    private final TenantManagementService tenantManagementService;

    private final UserGroupRepository userGroupRepository;

    private final UserRepository userRepository;

    private final ResourceCategoryRepository resourceCategoryRepository;

    private final ResourceRepository resourceRepository;

    private final TagRepository tagRepository;

    private final ReservationDecisionRepository reservationDecisionRepository;

    private final ReservationRepository reservationRepository;

    private final TenantIntegrityService tenantIntegrityService;

    private final NotificationRepository notificationRepository;

    private final LogService logService;

    @Autowired
    public DemoTenantBuilder(TenantRepository tenantRepository,
                             TenantManagementService tenantManagementService,
                             UserGroupRepository userGroupRepository,
                             UserRepository userRepository,
                             ResourceCategoryRepository resourceCategoryRepository,
                             ResourceRepository resourceRepository,
                             TagRepository tagRepository,
                             ReservationDecisionRepository reservationDecisionRepository,
                             ReservationRepository reservationRepository,
                             TenantIntegrityService tenantIntegrityService,
                             NotificationRepository notificationRepository,
                             LogService logService) {
        this.tenantRepository = tenantRepository;
        this.tenantManagementService = tenantManagementService;
        this.userGroupRepository = userGroupRepository;
        this.userRepository = userRepository;
        this.resourceCategoryRepository = resourceCategoryRepository;
        this.resourceRepository = resourceRepository;
        this.tagRepository = tagRepository;
        this.reservationDecisionRepository = reservationDecisionRepository;
        this.reservationRepository = reservationRepository;
        this.tenantIntegrityService = tenantIntegrityService;
        this.notificationRepository = notificationRepository;
        this.logService = logService;
    }

    /**
     * Deletes and re-builds the demo Tenant every 24 hours.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Async
    public void rebuildDemoTenantAsync() {
        this.rebuildDemoTenant();
    }

    /**
     * Deletes and re-builds the demo Tenant
     */
    public void rebuildDemoTenant() {
        logService.logDebug(getClass(), "Rebuilding Demo Tenant...");

        //Find and delete old demo tenant
        demoTenant = tenantRepository.findTenantBySlug("demo");
        if (demoTenant != null) {
            tenantRepository.delete(demoTenant);
        }

        //Create new demo tenant
        demoTenant = new Tenant();
        demoTenant.slug = "demo";
        demoTenant.tier = Tenant.Tier.PLATINUM;
        demoTenant.subscriptionId = -1;
        demoTenant.setActive(true);
        demoTenant.adminEmail = null;
        demoTenant = tenantRepository.save(demoTenant);
        tenantIntegrityService.initializeNewTenant(demoTenant);

        User adminUser = userRepository.findByEmailAddress(UserRepository.ADMIN_EMAIL_ADDRESS, demoTenant);
        if (adminUser != null) {
            try {
                adminUser.hashedPassword = PasswordStorage.createHash("demo");
                userRepository.save(adminUser);
            } catch (PasswordStorage.CannotPerformOperationException e) {
                logService.logException(getClass(), e, "Could not change admin password.");
            }
        }

        //Add User Groups
        UserGroup administratorsUserGroup = createUserGroup(
                "Administrators",
                userGroupRepository.findRootGroup(demoTenant),
                null
        );

        UserGroup librariansUserGroup = createUserGroup(
                "Librarians",
                administratorsUserGroup,
                null
        );

        UserGroup teachersUserGroup = createUserGroup(
                "Teachers",
                librariansUserGroup,
                null
        );


        //Add Users
        User administrator = createUser(
                "admin@aptitekk.com",
                "Jill",
                "Administrator",
                "demo",
                administratorsUserGroup);

        User teacher = createUser(
                "teacher@aptitekk.com",
                "John",
                "Teacher",
                "demo",
                teachersUserGroup);

        User librarian = createUser(
                "librarian@aptitekk.com",
                "Julia",
                "Librarian",
                "demo",
                librariansUserGroup
        );

        //Add Resource Categories
        ResourceCategory rooms = resourceCategoryRepository.findByName("Rooms", demoTenant);
        ResourceCategory equipment = createResourceCategory("Equipment");

        //Add Tags
        List<Tag> cart1Tags = new ArrayList<>();
        List<Tag> cart2Tags = new ArrayList<>();

        Tag adobeTag = new Tag();
        adobeTag.name = "adobe";
        adobeTag.tenant = demoTenant;
        adobeTag.resourceCategory = equipment;
        adobeTag = tagRepository.save(adobeTag);
        cart1Tags.add(adobeTag);

        Tag officeTag = new Tag();
        officeTag.name = "office";
        officeTag.tenant = demoTenant;
        officeTag.resourceCategory = equipment;
        officeTag = tagRepository.save(officeTag);
        cart1Tags.add(officeTag);
        cart2Tags.add(officeTag);

        Tag chromebookTag = new Tag();
        chromebookTag.name = "chromebook";
        chromebookTag.tenant = demoTenant;
        chromebookTag.resourceCategory = equipment;
        chromebookTag = tagRepository.save(chromebookTag);
        cart1Tags.add(chromebookTag);

        Set<Tag> availableTags = new HashSet<>();
        availableTags.add(adobeTag);
        availableTags.add(officeTag);
        availableTags.add(chromebookTag);
        equipment.tags = availableTags;
        equipment = resourceCategoryRepository.save(equipment);

        //Add resources
        Resource library = createResource(
                "Library",
                rooms,
                librariansUserGroup,
                true,
                null
        );

        Resource cart1 = createResource(
                "Cart 1",
                equipment,
                administratorsUserGroup,
                true,
                cart1Tags
        );

        Resource cart2 = createResource(
                "Cart 2",
                equipment,
                administratorsUserGroup,
                true,
                cart2Tags
        );

        Resource teacherLaptop = createResource(
                "Teacher Laptop",
                equipment,
                teachersUserGroup,
                true,
                null
        );

        //Add reservations
        Reservation teacherLaptopReservation = createReservation(
                teacher,
                "Test",
                Reservation.Status.APPROVED,
                teacherLaptop,
                6, 7,
                12, 33,
                15, 0
        );

        Reservation libraryReservation = createReservation(
                teacher,
                "Book Fair",
                Reservation.Status.APPROVED,
                library,
                25, 28,
                8, 30,
                15, 0
        );

        Reservation libraryReservation2 = createReservation(
                teacher,
                "Essay Research",
                Reservation.Status.PENDING,
                library,
                10, 10,
                12, 0,
                15, 30);

        Reservation cart1Reservation = createReservation(
                teacher,
                "Sage Testing",
                Reservation.Status.APPROVED,
                cart1,
                5, 6,
                13, 30,
                16, 45);

        //Add reservation decisions
        createReservationDecision(
                libraryReservation,
                librariansUserGroup,
                librarian,
                false
        );
        createReservationDecision(
                libraryReservation,
                administratorsUserGroup,
                administrator,
                true
        );

        createReservationDecision(
                libraryReservation2,
                administratorsUserGroup,
                administrator,
                true
        );

        createReservationDecision(
                cart1Reservation,
                administratorsUserGroup,
                administrator,
                true
        );

        createReservationDecision(
                teacherLaptopReservation,
                teachersUserGroup,
                teacher,
                true
        );

        //Add Notifications
        Notification notification = new Notification(teacher, "Test Notification", "Lorem ipsum");
        notification.tenant = demoTenant;
        notification.setRead(false);
        //TODO: Make method in user repository to get admin user, set admin to get notifications.
        notification = notificationRepository.save(notification);


        tenantManagementService.refresh();

        logService.logDebug(getClass(), "Demo Tenant Rebuilt");
    }


    /**
     * Creates a User Group
     *
     * @param name        The name of the User Group
     * @param parent      The User Group's parent
     * @param permissions A list of permissions for the User Group
     * @return A new, saved User Group.
     */
    private UserGroup createUserGroup(String name,
                                      UserGroup parent,
                                      List<Permission> permissions) {
        UserGroup userGroup = new UserGroup();
        userGroup.tenant = demoTenant;
        userGroup.name = name;
        userGroup.parent = parent;
        userGroup.permissions = permissions;

        return userGroupRepository.save(userGroup);
    }

    /**
     * Creates a User.
     *
     * @param emailAddress The user's email address.
     * @param firstName    The user's first name.
     * @param lastName     The user's last name.
     * @param password     The user's password (not hashed)
     * @param userGroups   Any user groups the user should be assigned to.
     * @return A new, saved User.
     */
    private User createUser(String emailAddress,
                            String firstName,
                            String lastName,
                            String password,
                            UserGroup... userGroups) {
        User user = new User();
        user.tenant = demoTenant;
        user.setEmailAddress(emailAddress);
        user.firstName = firstName;
        user.lastName = lastName;
        user.verified = true;
        user.userState = User.State.APPROVED;
        try {
            user.hashedPassword = PasswordStorage.createHash(password);
        } catch (PasswordStorage.CannotPerformOperationException e) {
            logService.logException(getClass(), e, "Could not save demo user's password");
        }
        user.userGroups.addAll(Arrays.asList(userGroups));
        return userRepository.save(user);
    }

    /**
     * Creates a Resource Category.
     *
     * @param name The name of the category.
     * @return A new, saved Resource Category.
     */
    private ResourceCategory createResourceCategory(String name) {
        ResourceCategory resourceCategory = new ResourceCategory();
        resourceCategory.tenant = demoTenant;
        resourceCategory.name = name;

        return resourceCategoryRepository.save(resourceCategory);
    }

    /**
     * Creates a Resource.
     *
     * @param name             The name of the resource
     * @param resourceCategory The category of the resource.
     * @param requiresApproval Whether or not approval is required of the resource's reservations.
     * @param tags             A list of tags assigned to the resource.
     * @return A new, saved Resource.
     */
    private Resource createResource(String name,
                                    ResourceCategory resourceCategory,
                                    UserGroup ownerGroup,
                                    boolean requiresApproval,
                                    List<Tag> tags) {
        Resource resource = new Resource();
        resource.tenant = demoTenant;
        resource.name = name;
        resource.resourceCategory = resourceCategory;
        resource.owner = ownerGroup;
        resource.needsApproval = requiresApproval;
        resource.tags = tags;

        return resourceRepository.save(resource);
    }

    /**
     * Creates a Reservation.
     *
     * @param user        The user who "reserved" the resource
     * @param title       The title of the reservation
     * @param status      The status of the reservation
     * @param resource    The resource being reserved
     * @param startDay    The day of month that the reservation starts on.
     * @param endDay      The day of month the reservation ends on.
     * @param startHour   The hour of the day (24 hr) that the reservation starts at.
     * @param startMinute The minute of the hour the reservation starts at.
     * @param endHour     The hour of the day (24 hr) that the reservation ends at.
     * @param endMinute   The minute of the hour that the reservation ends at.
     * @return A new, saved Reservation.
     */
    private Reservation createReservation(User user,
                                          String title, Reservation.Status status,
                                          Resource resource,
                                          int startDay, int endDay,
                                          int startHour, int startMinute,
                                          int endHour, int endMinute) {
        Reservation reservation = new Reservation();
        reservation.tenant = demoTenant;
        reservation.user = user;
        reservation.title = title;
        reservation.status = status;
        reservation.resource = resource;
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
        reservation.start = start.toLocalDateTime();
        reservation.end = end.toLocalDateTime();
        return reservationRepository.save(reservation);
    }

    /**
     * Creates a Reservation Decision
     *
     * @param reservation The reservation being decided upon.
     * @param userGroup   The user group who made the decision.
     * @param user        The user who made the decision on behalf of the group.
     * @param approved    If the decision was an approval or rejection.
     * @return A new, saved Reservation Decision.
     */
    private ReservationDecision createReservationDecision(Reservation reservation,
                                                          UserGroup userGroup,
                                                          User user,
                                                          boolean approved) {
        ReservationDecision reservationDecision = new ReservationDecision();
        reservationDecision.tenant = demoTenant;
        reservationDecision.reservation = reservation;
        reservationDecision.userGroup = userGroup;
        reservationDecision.user = user;
        reservationDecision.approved = approved;
        return reservationDecisionRepository.save(reservationDecision);
    }

}
