/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services;

import com.aptitekk.aptibook.core.cron.DemoTenantBuilder;
import com.aptitekk.aptibook.core.cron.NotificationCleaner;
import com.aptitekk.aptibook.core.cron.TenantSynchronizer;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.domain.repositories.TenantRepository;
import com.aptitekk.aptibook.core.services.tenant.TenantIntegrityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.Serializable;
import java.util.TimeZone;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Scope(BeanDefinition.SCOPE_SINGLETON)
public class StartupService implements Serializable {

    private final TenantRepository tenantRepository;

    private final TenantIntegrityService tenantIntegrityService;

    private final NotificationCleaner notificationCleaner;
    private final TenantSynchronizer tenantSynchronizer;

    private final DemoTenantBuilder demoTenantBuilder;
    private final LogService logService;

    private static final AtomicBoolean started = new AtomicBoolean(false);

    @Autowired
    public StartupService(TenantRepository tenantRepository,
                          TenantIntegrityService tenantIntegrityService,
                          NotificationCleaner notificationCleaner,
                          TenantSynchronizer tenantSynchronizer,
                          DemoTenantBuilder demoTenantBuilder,
                          LogService logService) {
        this.tenantRepository = tenantRepository;
        this.tenantIntegrityService = tenantIntegrityService;
        this.notificationCleaner = notificationCleaner;
        this.tenantSynchronizer = tenantSynchronizer;
        this.demoTenantBuilder = demoTenantBuilder;
        this.logService = logService;
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

        for (Tenant tenant : tenantRepository.findAll()) {
            tenantIntegrityService.ensureTenantIntegrity(tenant);
        }

        started.set(true);

        notificationCleaner.cleanReadNotifications();
        tenantSynchronizer.synchronizeTenants();
        demoTenantBuilder.rebuildDemoTenant();
    }

    public static boolean isStarted() {
        return started.get();
    }

}
