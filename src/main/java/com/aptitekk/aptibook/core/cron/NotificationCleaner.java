/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.cron;

import com.aptitekk.aptibook.core.domain.entities.Notification;
import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.logging.LogService;
import com.aptitekk.aptibook.core.services.StartupService;
import com.aptitekk.aptibook.core.services.entities.NotificationService;
import com.aptitekk.aptibook.core.services.entities.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.threeten.extra.Days;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@Scope(BeanDefinition.SCOPE_SINGLETON)
public class NotificationCleaner {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private LogService logService;

    /**
     * Cleans up Notifications every hour.
     * If the Notification is >= 3 days old and has been read, it will be removed.
     */
    @Scheduled(cron = "0 * * * *") //Every hour.
    private void cleanReadNotifications() {
        logService.logDebug(getClass(), "Cleaning Notifications...");

        if (!StartupService.isStarted()) {
            logService.logInfo(getClass(), "Skipping run since AptiBook is not started.");
            return;
        }

        int numNotificationsRemoved = 0;
        List<Tenant> tenants = tenantService.findAll();
        for (Tenant tenant : tenants) {
            List<Notification> notifications = notificationService.findAllForTenant(tenant);
            for (Notification notification : notifications) {
                if (notification.getRead() && Days.between(notification.getCreation(), ZonedDateTime.now()).getAmount() > 3) {
                    try {
                        notificationService.delete(notification);
                        numNotificationsRemoved++;
                    } catch (Exception e) {
                        logService.logException(getClass(), e, "Could not delete Notification on cleanup.");
                    }
                }
            }
        }

        logService.logDebug(getClass(), "Removed " + numNotificationsRemoved + " old Notifications. Cleaning complete.");
    }

}
