/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.domain.entities;

import com.aptitekk.aptibook.core.domain.entities.enums.property.Property;
import com.aptitekk.aptibook.core.services.stripe.StripeService;
import com.aptitekk.aptibook.core.util.EqualsHelper;

import javax.persistence.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
public class Tenant extends GlobalEntity {

    @Id
    @GeneratedValue
    public Long id;

    @Column(nullable = false, unique = true)
    public String stripeSubscriptionId;

    @Enumerated(EnumType.STRING)
    public StripeService.Plan stripePlan;

    @Enumerated(EnumType.STRING)
    public StripeService.Status stripeStatus;

    @Column(nullable = false, unique = true)
    public String domain;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "tenant_properties", joinColumns = @JoinColumn(name = "tenant_id"))
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "key")
    @Column(name = "value")
    public Map<Property.Key, String> properties = new HashMap<>();

    // ---- Tenant Dependent Entities ---- //

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<Resource> resources;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<ResourceCategory> resourceCategories;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<File> files;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<ReservationDecision> reservationDecisions;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<ReservationField> reservationFields;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<ReservationFieldEntry> reservationFieldEntries;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<Tag> tags;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<User> users;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<UserGroup> userGroups;

    // ---- End Tenant Dependent Entities ---- //

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null) return false;

        if (!(o instanceof Tenant)) return false;

        Tenant other = (Tenant) o;

        return EqualsHelper.areEquals(stripeSubscriptionId, other.stripeSubscriptionId)
                && EqualsHelper.areEquals(stripePlan, other.stripePlan)
                && EqualsHelper.areEquals(stripeStatus, other.stripeStatus)
                && EqualsHelper.areEquals(domain, other.domain);
    }

    @Override
    public int hashCode() {
        return EqualsHelper.calculateHashCode(stripeSubscriptionId, stripePlan, stripeStatus, domain);
    }
}
