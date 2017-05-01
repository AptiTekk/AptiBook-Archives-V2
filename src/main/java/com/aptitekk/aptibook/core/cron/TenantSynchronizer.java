/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.cron;

import com.aptitekk.aptibook.core.domain.entities.ResourceCategory;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.entities.User;
import com.aptitekk.aptibook.core.domain.entities.UserGroup;
import com.aptitekk.aptibook.core.domain.repositories.ResourceCategoryRepository;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserGroupRepository;
import com.aptitekk.aptibook.core.domain.repositories.UserRepository;
import com.aptitekk.aptibook.core.security.PasswordUtils;
import com.aptitekk.aptibook.core.services.EmailService;
import com.aptitekk.aptibook.core.services.LogService;
import com.aptitekk.aptibook.core.services.SpringProfileService;
import com.aptitekk.aptibook.core.services.StartupService;
import com.aptitekk.aptibook.core.services.stripe.StripeService;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.aptitekk.aptibook.core.util.PasswordGenerator;
import com.stripe.model.Customer;
import com.stripe.model.SubscriptionCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TenantSynchronizer {

    private static final String TENANT_DOMAIN_META_KEY = "domain";

    private final TenantRepository tenantRepository;

    private final TenantManagementService tenantManagementService;

    private final SpringProfileService springProfileService;
    private final UserGroupRepository userGroupRepository;
    private final UserRepository userRepository;
    private final ResourceCategoryRepository resourceCategoryRepository;
    private final EmailService emailService;
    private final StripeService stripeService;

    private final LogService logService;

    @Autowired
    public TenantSynchronizer(TenantRepository tenantRepository,
                              TenantManagementService tenantManagementService,
                              SpringProfileService springProfileService,
                              UserGroupRepository userGroupRepository,
                              UserRepository userRepository,
                              ResourceCategoryRepository resourceCategoryRepository,
                              EmailService emailService,
                              StripeService stripeService,
                              LogService logService) {
        this.tenantRepository = tenantRepository;
        this.tenantManagementService = tenantManagementService;
        this.springProfileService = springProfileService;
        this.userGroupRepository = userGroupRepository;
        this.userRepository = userRepository;
        this.resourceCategoryRepository = resourceCategoryRepository;
        this.emailService = emailService;
        this.stripeService = stripeService;
        this.logService = logService;

    }

    /**
     * Synchronizes the Tenants in the database with Subscription data from Stripe.
     * Runs every minute.
     */
    @Scheduled(cron = "0 * * * * *")
    @Async
    public void synchronizeTenants() {
        logService.logDebug(getClass(), "Synchronizing Tenants.");

        // Make sure the application has been initialized.
        if (!StartupService.isStarted()) {
            logService.logInfo(getClass(), "Skipping run since AptiBook is not started.");
            return;
        }

        // Make sure StripeService is ready.
        if (!stripeService.isReady()) {
            logService.logInfo(getClass(), "Skipping run since StripeService is not ready.");
            return;
        }

        // The subscription collections for all plans.
        SubscriptionCollection[] subscriptionCollections = stripeService.getSubscriptionCollections();
        if (subscriptionCollections == null) {
            logService.logError(getClass(), "Could not synchronize Tenants, as the subscription collection was null.");
            return;
        }

        // Keeps track of the encountered subscription IDs while iterating so that the subscriptions which have been
        // deleted (and therefore are not encountered) will be marked inactive.
        Set<String> encounteredSubscriptionIds = new HashSet<>();

        // For each stripePlan:
        for (StripeService.Plan plan : StripeService.Plan.values()) {
            // The subscription collection for this stripePlan.
            SubscriptionCollection subscriptionCollection = subscriptionCollections[plan.ordinal()];

            // For each subscription associated with the stripePlan:
            for (com.stripe.model.Subscription subscription : subscriptionCollection.autoPagingIterable()) {
                encounteredSubscriptionIds.add(subscription.getId());

                // Get the tenant's domain from the metadata.
                String domain = subscription.getMetadata().get(TENANT_DOMAIN_META_KEY);
                if (domain == null || domain.isEmpty()) {
                    logService.logError(getClass(), "A subscription without a Tenant domain was found; ID: " + subscription.getId());
                    return;
                }

                // The status of the subscription.
                StripeService.Status status;
                try {
                    status = StripeService.Status.valueOf(subscription.getStatus().toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Exception is thrown if the enum value can't be found.
                    logService.logError(getClass(), "A subscription with an invalid status was found; status: " + subscription.getStatus());
                    return;
                }

                Tenant currentTenant = tenantRepository.findTenantByStripeSubscriptionId(subscription.getId());
                if (currentTenant != null) {
                    updateDomainIfNeeded(currentTenant, domain);
                    updateStatusIfNeeded(currentTenant, status);
                    updatePlanIfNeeded(currentTenant, plan);
                } else {
                    createNewTenant(subscription.getId(), subscription.getCustomer(), domain, status, plan);
                }
            }
        }

        // Check for deleted Tenants.
        for (Tenant tenant : tenantRepository.findAll()) {
            if (tenant.stripeStatus == StripeService.Status.CANCELED) {
                //TODO: check timer and delete Tenant if necessary.
                continue;
            }

            // If the Subscription still exists (cancelled, active, or otherwise), then it will have been encountered.
            if (encounteredSubscriptionIds.contains(tenant.stripeSubscriptionId))
                continue;

            // Don't delete the demo.
            if (tenant.domain.equalsIgnoreCase("demo"))
                continue;

            // Set the Tenant to Cancelled.
            tenant.stripeStatus = StripeService.Status.CANCELED;
            // Set the domain to the Subscription ID to free up the domain for other Tenants.
            tenant.domain = tenant.stripeSubscriptionId;
            logService.logInfo(getClass(), "Set Tenant status to CANCELED. Will be deleted in 30 days.\n" +
                    "\tSubscription ID: " + tenant.stripeSubscriptionId + "\n" +
                    "\tDomain: " + tenant.domain);

            tenantRepository.save(tenant);
            // TODO: start deletion timer (30 days?)
        }

        tenantManagementService.refresh();
    }

    /**
     * Updates the Tenant with a new domain if needed.
     * Will not update if the domain is already in use by another Tenant.
     *
     * @param tenant The Tenant. Should not be null.
     * @param domain The domain to use. Should not be null or empty.
     */
    private void updateDomainIfNeeded(Tenant tenant, String domain) {
        if (tenant == null)
            throw new IllegalArgumentException("Tenant was null.");
        if (domain == null || domain.isEmpty())
            throw new IllegalArgumentException("Domain was null or empty.");

        if (!tenant.domain.equalsIgnoreCase(domain)) {

            // Check for conflicts.
            Tenant tenantByDomain = tenantRepository.findTenantByDomain(domain);
            if (tenantByDomain != null) {
                logService.logException(getClass(), new TenantDomainConflictException(domain, tenantByDomain, tenant), "A domain conflict occurred while updating a Tenant's domain.");
                return;
            }

            logService.logInfo(getClass(), "Tenant Domain Updated.\n" +
                    "\tSubscription ID: " + tenant.stripeSubscriptionId + "\n" +
                    "\tOld Domain: " + tenant.domain + "\n" +
                    "\tNew Domain: " + domain);

            tenant.domain = domain.toLowerCase();
            tenantRepository.save(tenant);
        }
    }

    /**
     * Updates the Tenant with a new Status if needed.
     *
     * @param tenant The Tenant. Should not be null.
     * @param status The Status to use. Should not be null.
     */
    private void updateStatusIfNeeded(Tenant tenant, StripeService.Status status) {
        if (tenant == null)
            throw new IllegalArgumentException("Tenant was null.");
        if (status == null)
            throw new IllegalArgumentException("Status was null.");

        if (tenant.stripeStatus != status) {

            logService.logInfo(getClass(), "Tenant Status Updated.\n" +
                    "\tSubscription ID: " + tenant.stripeSubscriptionId + "\n" +
                    "\tOld Status: " + tenant.stripeStatus + "\n" +
                    "\tNew Status: " + status);

            tenant.stripeStatus = status;
            tenantRepository.save(tenant);
        }
    }

    /**
     * Updates the Tenant with a new Plan if needed.
     *
     * @param tenant The Tenant. Should not be null.
     * @param plan   The Plan to use. Should not be null.
     */
    private void updatePlanIfNeeded(Tenant tenant, StripeService.Plan plan) {
        if (tenant == null)
            throw new IllegalArgumentException("Tenant was null.");
        if (plan == null)
            throw new IllegalArgumentException("Plan was null.");

        if (tenant.stripePlan != plan) {

            logService.logInfo(getClass(), "Tenant Plan Updated.\n" +
                    "\tSubscription ID: " + tenant.stripeSubscriptionId + "\n" +
                    "\tOld Plan: " + tenant.stripePlan + "\n" +
                    "\tNew Plan: " + plan);

            tenant.stripePlan = plan;
            tenantRepository.save(tenant);
        }
    }

    /**
     * Creates a new Tenant with the provided info and inserts it into the database.
     *
     * @param subscriptionId The Stripe Subscription ID associated with this Tenant.
     * @param customerId     The ID of the customer associated with the Subscription. Used for sending emails.
     * @param domain         The domain associated with this Tenant.
     * @param status         The Status of the Stripe Subscription.
     * @param plan           The Plan associated with the Stripe Subscription.
     */
    private void createNewTenant(String subscriptionId, String customerId, String domain, StripeService.Status status, StripeService.Plan plan) {
        if (subscriptionId == null || subscriptionId.isEmpty())
            throw new IllegalArgumentException("Subscription ID was null or empty.");
        if (customerId == null || customerId.isEmpty())
            throw new IllegalArgumentException("Subscription ID was null or empty.");
        if (domain == null || domain.isEmpty())
            throw new IllegalArgumentException("Domain was null or empty.");
        if (status == null)
            throw new IllegalArgumentException("Status was null.");
        if (plan == null)
            throw new IllegalArgumentException("Plan was null.");

        Tenant newTenant = new Tenant();
        newTenant.stripeSubscriptionId = subscriptionId;
        newTenant.domain = domain;
        newTenant.stripeStatus = status;
        newTenant.stripePlan = plan;

        // Check for domain conflicts.
        Tenant tenantByDomain = tenantRepository.findTenantByDomain(domain);
        if (tenantByDomain != null) {
            logService.logException(getClass(), new TenantDomainConflictException(domain, tenantByDomain, newTenant), "A domain conflict occurred while creating a new Tenant.");
            return;
        }

        // Save the new Tenant.
        newTenant = tenantRepository.save(newTenant);

        // Create the root group.
        UserGroup rootGroup = new UserGroup();
        rootGroup.setName(UserGroupRepository.ROOT_GROUP_NAME);
        rootGroup.tenant = newTenant;
        rootGroup = userGroupRepository.save(rootGroup);

        // Create the admin user
        User admin = new User();
        admin.setAdmin(true);
        admin.tenant = newTenant;
        admin.userGroups.add(rootGroup);

        // If in Production, we generate a random password and email the admin. Otherwise, we use the password "admin".
        if (springProfileService.isProfileActive(SpringProfileService.Profile.PRODUCTION)) {
            Customer customer = stripeService.getCustomerById(customerId);
            if (customer == null) {
                logService.logException(getClass(), new TenantCreationException(), "Could not create Tenant because the Customer was null");
                return;
            }

            String password = PasswordGenerator.generateRandomPassword(10);
            admin.setHashedPassword(PasswordUtils.encodePassword(password));
            //FIXME: Domain in the email may be different if the customer uses a CNAME.
            emailService.sendEmailNotification(customer.getEmail(), "AptiBook Registration",
                    "<p>Thank you for registering with us! We are very excited to hear about how you and your team uses AptiBook.</p>"
                            + "<p>You can sign in to AptiBook using the URL and credentials below. Once you sign in, you can change your password by clicking <b>My Account</b> on the navigation bar.<br>"
                            + "https://" + domain + ".aptibook.net</p>"
                            + "<center>"
                            + "Username: <b>admin</b> <br>"
                            + "Password: <b>" + password + "</b>"
                            + "</center>"
                            + "<p>Please let us know of any way we can be of assistance, and be sure to check out our knowledge base at https://support.aptitekk.com/.</p>");
        } else {
            admin.setHashedPassword(PasswordUtils.encodePassword("admin"));
        }
        admin.setVerified(true);
        userRepository.save(admin);

        // Create the Rooms Resource Category
        ResourceCategory rooms = new ResourceCategory();
        rooms.name = "Rooms";
        rooms.tenant = newTenant;
        resourceCategoryRepository.save(rooms);

        logService.logInfo(getClass(), "Created New Tenant.\n" +
                "\tSubscription ID: " + newTenant.stripeSubscriptionId + "\n" +
                "\tDomain: " + newTenant.domain + "\n" +
                "\tStatus: " + newTenant.stripeStatus + "\n" +
                "\tPlan: " + newTenant.stripePlan + "\n");
    }

    private void deleteTenant(Tenant tenant) {
        if (tenant == null)
            throw new IllegalArgumentException("Tenant was null.");

        logService.logInfo(getClass(), "Deleting the Tenant with Subscription ID: " + tenant.stripeSubscriptionId + " and domain: " + tenant.domain);

        this.tenantRepository.delete(tenant);
    }

    /**
     * Thrown when two Tenants try to share the same domain.
     */
    private static class TenantDomainConflictException extends Exception {
        TenantDomainConflictException(String domain, Tenant ownerTenant, Tenant otherTenant) {
            super("Tried to assign an existing domain to a Tenant! " +
                    "Domain: " + domain + "; " +
                    "Owner Tenant Subscription ID: " + ownerTenant.stripeSubscriptionId + "; " +
                    "Other Tenant Subscription ID: " + otherTenant.stripeSubscriptionId);
        }
    }

    private static class TenantCreationException extends Exception {
        TenantCreationException() {
            super();
        }

        TenantCreationException(String message) {
            super(message);
        }

        TenantCreationException(String message, Throwable cause) {
            super(message, cause);
        }

        TenantCreationException(Throwable cause) {
            super(cause);
        }

        TenantCreationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
            super(message, cause, enableSuppression, writableStackTrace);
        }
    }

}
