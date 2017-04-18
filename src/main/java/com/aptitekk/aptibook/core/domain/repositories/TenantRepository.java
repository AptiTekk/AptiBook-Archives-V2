/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.repositories;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.repositories.annotations.EntityRepository;

import javax.persistence.PersistenceException;

@EntityRepository
public class TenantRepository extends GlobalEntityRepositoryAbstract<Tenant> {

    /**
     * Finds a Tenant in the database by its Stripe Subscription ID.
     *
     * @param stripeSubscriptionId The ID to lookup.
     * @return The Tenant, if found. Null otherwise.
     */
    public Tenant findTenantByStripeSubscriptionId(String stripeSubscriptionId) {
        try {
            return entityManager
                    .createQuery("SELECT t FROM Tenant t WHERE t.stripeSubscriptionId = ?1", Tenant.class)
                    .setParameter(1, stripeSubscriptionId)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

    /**
     * Finds a Tenant in the database by its domain.
     *
     * @param domain The domain to lookup.
     * @return The Tenant, if found. Null otherwise.
     */
    public Tenant findTenantByDomain(String domain) {
        try {
            return entityManager
                    .createQuery("SELECT t FROM Tenant t WHERE t.domain = ?1", Tenant.class)
                    .setParameter(1, domain)
                    .getSingleResult();
        } catch (PersistenceException e) {
            return null;
        }
    }

}
