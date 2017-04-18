/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services;

import com.aptitekk.aptibook.core.cron.DemoTenantBuilder;
import com.aptitekk.aptibook.core.cron.NotificationCleaner;
import com.aptitekk.aptibook.core.cron.TenantSynchronizer;
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


    private final NotificationCleaner notificationCleaner;
    private final TenantSynchronizer tenantSynchronizer;

    private final DemoTenantBuilder demoTenantBuilder;

    private static final AtomicBoolean started = new AtomicBoolean(false);

    @Autowired
    public StartupService(NotificationCleaner notificationCleaner,
                          TenantSynchronizer tenantSynchronizer,
                          DemoTenantBuilder demoTenantBuilder) {
        this.notificationCleaner = notificationCleaner;
        this.tenantSynchronizer = tenantSynchronizer;
        this.demoTenantBuilder = demoTenantBuilder;
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        started.set(true);

        notificationCleaner.cleanReadNotifications();
        tenantSynchronizer.synchronizeTenants();
        demoTenantBuilder.rebuildDemoTenant();
    }

    public static boolean isStarted() {
        return started.get();
    }

}
