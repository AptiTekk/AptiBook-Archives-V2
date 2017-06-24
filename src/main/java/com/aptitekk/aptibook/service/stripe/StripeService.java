/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.service.stripe;

import com.aptitekk.aptibook.service.LogService;
import com.aptitekk.aptibook.service.SpringProfileService;
import com.stripe.Stripe;
import com.stripe.exception.*;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {

    private static final String SECRET_KEY = System.getenv("STRIPE_SECRET_KEY");

    private final LogService logService;
    private final SpringProfileService springProfileService;

    @Autowired
    public StripeService(LogService logService,
                         SpringProfileService springProfileService) {
        this.logService = logService;
        this.springProfileService = springProfileService;
    }

    @PostConstruct
    private void init() {
        // Don't bother setting up Stripe for JUnit Testing.
        if (springProfileService.isProfileActive(SpringProfileService.Profile.TESTING))
            return;

        if (SECRET_KEY == null || SECRET_KEY.isEmpty()) {
            throw new IllegalStateException("Stripe Secret Key Environment Variable not Found!");
        }

        Stripe.apiKey = SECRET_KEY;
        this.logService.logInfo(getClass(), "Connected to Stripe.");
    }

    /**
     * Determines if the service is ready to be used.
     *
     * @return True if ready, false otherwise.
     */
    public boolean isReady() {
        return Stripe.apiKey != null;
    }

    /**
     * Retrieves collections of subscriptions for each Plan.
     *
     * @return The SubscriptionCollections from Stripe, containing subscriptions related to AptiBook.
     * The array is ordered by ordinal of the {@link Plan} enum. In the event of an error, null is returned.
     */
    public SubscriptionCollection[] getSubscriptionCollections() {
        Map<String, Object> params = new HashMap<>();
        params.put("limit", 100);
        try {
            // The array will contain a SubscriptionCollection for each Plan, in order by enum ordinal.
            SubscriptionCollection[] subscriptionCollections = new SubscriptionCollection[Plan.values().length];

            // For each Plan, fetch the SubscriptionCollection.
            for (int planOrdinal = 0; planOrdinal < subscriptionCollections.length; planOrdinal++) {
                params.put("plan", Plan.values()[planOrdinal].getStripePlanId());
                subscriptionCollections[planOrdinal] = Subscription.list(params);
            }

            return subscriptionCollections;
        } catch (AuthenticationException e) {
            this.logService.logException(getClass(), e, "Authentication failed when getting Subscriptions from Stripe");
        } catch (InvalidRequestException e) {
            this.logService.logException(getClass(), e, "An invalid request was made when getting Subscriptions from Stripe");
        } catch (APIConnectionException e) {
            this.logService.logException(getClass(), e, "Could not connect to Stripe when getting Subscriptions");
        } catch (CardException | APIException e) {
            this.logService.logException(getClass(), e, "An unknown error occurred getting Subscriptions from Stripe");
        }

        return null;
    }

    /**
     * Retrieves a Customer from Stripe by their ID.
     *
     * @param customerId The ID of the Customer.
     * @return The Customer object if successfully fetched, or null otherwise.
     */
    public Customer getCustomerById(String customerId) {
        try {
            return Customer.retrieve(customerId);
        } catch (AuthenticationException e) {
            this.logService.logException(getClass(), e, "Authentication failed when getting a Customer from Stripe");
        } catch (InvalidRequestException e) {
            this.logService.logException(getClass(), e, "An invalid request was made when getting a Customer from Stripe");
        } catch (APIConnectionException e) {
            this.logService.logException(getClass(), e, "Could not connect to Stripe when getting a Customer");
        } catch (CardException | APIException e) {
            this.logService.logException(getClass(), e, "An unknown error occurred getting a Customer from Stripe");
        }

        return null;
    }

    /**
     * Represents the different AptiBook Subscription Plans and their relationships to Stripe.
     */
    public enum Plan {
        BRONZE("aptibook-bronze"),
        SILVER("aptibook-silver"),
        PLATINUM("aptibook-platinum");


        private final String stripePlanId;

        Plan(String stripePlanId) {
            this.stripePlanId = stripePlanId;
        }

        public String getStripePlanId() {
            return stripePlanId;
        }
    }

    /**
     * Represents the different Status codes for Stripe Subscriptions. (The lowercase version of the enum name is
     * identical to the Stripe status.)
     */
    public enum Status {
        TRIALING,
        ACTIVE,
        PAST_DUE,
        CANCELED,
        UNPAID
    }

}
