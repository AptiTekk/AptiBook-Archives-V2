/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.cron;

import com.aptitekk.aptibook.core.domain.entities.*;
import com.aptitekk.aptibook.core.domain.entities.enums.NotificationType;
import com.aptitekk.aptibook.core.domain.entities.enums.Permission;
import com.aptitekk.aptibook.core.domain.repositories.*;
import com.aptitekk.aptibook.core.security.PasswordUtils;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.stripe.StripeService;
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
        demoTenant = tenantRepository.findTenantByDomain("demo");
        if (demoTenant != null) {
            tenantRepository.delete(demoTenant);
        }

        //Create new demo tenant
        demoTenant = new Tenant();
        demoTenant.setDomain("demo");
        demoTenant.setStripeSubscriptionId("demo");
        demoTenant.setStripeStatus(StripeService.Status.ACTIVE);
        demoTenant.setStripePlan(StripeService.Plan.PLATINUM);
        demoTenant = tenantRepository.save(demoTenant);

        // Create the root group.
        UserGroup rootGroup = new UserGroup();
        rootGroup.setName(UserGroupRepository.ROOT_GROUP_NAME);
        rootGroup.setTenant(demoTenant);
        rootGroup = userGroupRepository.save(rootGroup);

        // Create the admin user
        User admin = new User();
        admin.setAdmin(true);
        admin.setTenant(demoTenant);
        admin.getUserGroups().add(rootGroup);
        admin.setHashedPassword(PasswordUtils.encodePassword("demo"));
        admin.setVerified(true);
        userRepository.save(admin);

        // Full Permission
        Set<Permission.Descriptor> fullPermissions = new HashSet<>();
        fullPermissions.add(Permission.Descriptor.GENERAL_FULL_PERMISSIONS);

        // Some Permission
        Set<Permission.Descriptor> somePermissions = new HashSet<>();
        somePermissions.add(Permission.Descriptor.PROPERTIES_MODIFY_ALL);
        somePermissions.add(Permission.Descriptor.GROUPS_MODIFY_ALL);

        // Notification Settings
        Map<NotificationType, User.NotificationToggles> notificationSettings = new HashMap<>();
        notificationSettings.put(NotificationType.APPROVAL_REQUEST, new User.NotificationToggles(true));

        //Add User Groups
        UserGroup administratorsUserGroup = createUserGroup(
                "Administrators",
                userGroupRepository.findRootGroup(demoTenant),
                fullPermissions
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
                null,
                notificationSettings,
                administratorsUserGroup);

        User teacher = createUser(
                "teacher@aptitekk.com",
                "John",
                "Teacher",
                "demo",
                null,
                null,
                teachersUserGroup);

        User librarian = createUser(
                "librarian@aptitekk.com",
                "Julia",
                "Librarian",
                "demo",
                somePermissions,
                null,
                librariansUserGroup
        );

        //Add Resource Categories
        ResourceCategory rooms = createResourceCategory("Rooms");
        ResourceCategory equipment = createResourceCategory("Equipment");

        //Add Tags
        List<Tag> cart1Tags = new ArrayList<>();
        List<Tag> cart2Tags = new ArrayList<>();

        Tag adobeTag = new Tag();
        adobeTag.setName("adobe");
        adobeTag.setTenant(demoTenant);
        adobeTag.setResourceCategory(equipment);
        adobeTag = tagRepository.save(adobeTag);
        cart1Tags.add(adobeTag);

        Tag officeTag = new Tag();
        officeTag.setName("office");
        officeTag.setTenant(demoTenant);
        officeTag.setResourceCategory(equipment);
        officeTag = tagRepository.save(officeTag);
        cart1Tags.add(officeTag);
        cart2Tags.add(officeTag);

        Tag chromebookTag = new Tag();
        chromebookTag.setName("chromebook");
        chromebookTag.setTenant(demoTenant);
        chromebookTag.setResourceCategory(equipment);
        chromebookTag = tagRepository.save(chromebookTag);
        cart1Tags.add(chromebookTag);

        Set<Tag> availableTags = new HashSet<>();
        availableTags.add(adobeTag);
        availableTags.add(officeTag);
        availableTags.add(chromebookTag);
        equipment.setTags(availableTags);
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
                Reservation.Status.REJECTED,
                library,
                10, 10,
                12, 0,
                15, 30);

        Reservation libraryReservation3 = createReservation(
                teacher,
                "Test",
                Reservation.Status.APPROVED,
                library,
                6, 7,
                12, 33,
                15, 0
        );

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
                false
        );

        createReservationDecision(
                libraryReservation3,
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


        //Add Notifications
        Notification notification = new Notification(teacher, "Test Notification", "Lorem ipsum");
        notification.setTenant(demoTenant);
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
                                      Set<Permission.Descriptor> permissions) {
        UserGroup userGroup = new UserGroup();
        userGroup.setTenant(demoTenant);
        userGroup.setName(name);
        userGroup.setParent(parent);
        userGroup.setPermissions(permissions);

        return userGroupRepository.save(userGroup);
    }

    /**
     * Creates a User.
     *
     * @param emailAddress         The user's email address.
     * @param firstName            The user's first name.
     * @param lastName             The user's last name.
     * @param password             The user's password (not hashed)
     * @param permissions           Any permissions to assign to the user.
     * @param notificationSettings A set of NotificationSettings for the user.
     * @param userGroups           Any user groups the user should be assigned to.
     * @return A new, saved User.
     */
    private User createUser(String emailAddress,
                            String firstName,
                            String lastName,
                            String password,
                            Set<Permission.Descriptor> permissions,
                            Map<NotificationType, User.NotificationToggles> notificationSettings,
                            UserGroup... userGroups) {
        User user = new User();
        user.setTenant(demoTenant);
        user.setEmailAddress(emailAddress);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setVerified(true);
        user.setHashedPassword(PasswordUtils.encodePassword(password));
        user.setPermissions(permissions);
        user.setNotificationSettings(notificationSettings);
        user.getUserGroups().addAll(Arrays.asList(userGroups));
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
        resourceCategory.setTenant(demoTenant);
        resourceCategory.setName(name);

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
        resource.setTenant(demoTenant);
        resource.setName(name);
        resource.setResourceCategory(resourceCategory);
        resource.setOwner(ownerGroup);
        resource.setNeedsApproval(requiresApproval);
        resource.setTags(tags);

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
        reservation.setTenant(demoTenant);
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
        reservationDecision.setTenant(demoTenant);
        reservationDecision.setReservation(reservation);
        reservationDecision.setUserGroup(userGroup);
        reservationDecision.setUser(user);
        reservationDecision.setApproved(approved);
        return reservationDecisionRepository.save(reservationDecision);
    }

}
