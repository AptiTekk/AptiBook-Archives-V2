/*
 * Copyright (C) 2016 - 2017 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.domain.entities;

import com.aptitekk.aptibook.domain.entities.property.Property;
import com.aptitekk.aptibook.service.stripe.StripeService;
import com.aptitekk.aptibook.util.EqualsHelper;

import javax.persistence.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("JpaDataSourceORMInspection")
@Entity
public class Tenant extends GlobalEntity {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String stripeSubscriptionId;

    @Enumerated(EnumType.STRING)
    private StripeService.Plan stripePlan;

    @Enumerated(EnumType.STRING)
    private StripeService.Status stripeStatus;

    @Column(nullable = false, unique = true)
    private String domain;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "tenant_properties", joinColumns = @JoinColumn(name = "tenant_id"))
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "key")
    @Column(name = "value")
    private Map<Property, String> properties = new HashMap<>();

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
    private List<Tag> tags;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<User> users;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.REMOVE)
    private List<UserGroup> userGroups;

    // ---- End Tenant Dependent Entities ---- //


    public Long getId() {
        return id;
    }

    public String getStripeSubscriptionId() {
        return stripeSubscriptionId;
    }

    public void setStripeSubscriptionId(String stripeSubscriptionId) {
        this.stripeSubscriptionId = stripeSubscriptionId;
    }

    public StripeService.Plan getStripePlan() {
        return stripePlan;
    }

    public void setStripePlan(StripeService.Plan stripePlan) {
        this.stripePlan = stripePlan;
    }

    public StripeService.Status getStripeStatus() {
        return stripeStatus;
    }

    public void setStripeStatus(StripeService.Status stripeStatus) {
        this.stripeStatus = stripeStatus;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public Map<Property, String> getProperties() {
        return properties;
    }

    public void setProperties(Map<Property, String> properties) {
        this.properties = properties;
    }

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
