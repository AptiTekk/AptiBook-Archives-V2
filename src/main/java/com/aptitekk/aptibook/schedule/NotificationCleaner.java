/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.schedule;

import com.aptitekk.aptibook.domain.entities.Notification;
import com.aptitekk.aptibook.domain.entities.Tenant;
import com.aptitekk.aptibook.service.LogService;
import com.aptitekk.aptibook.service.StartupService;
import com.aptitekk.aptibook.domain.repositories.NotificationRepository;
import com.aptitekk.aptibook.domain.repositories.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.threeten.extra.Days;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * This class cleans up read notifications after 3 days by deleting them from the database.
 */
@Service
@Scope(BeanDefinition.SCOPE_SINGLETON)
public class NotificationCleaner {

    private final TenantRepository tenantRepository;

    private final NotificationRepository notificationRepository;

    private final LogService logService;

    @Autowired
    public NotificationCleaner(TenantRepository tenantRepository, NotificationRepository notificationRepository, LogService logService) {
        this.tenantRepository = tenantRepository;
        this.notificationRepository = notificationRepository;
        this.logService = logService;
    }

    /**
     * Cleans up Notifications every hour.
     * If the Notification is >= 3 days old and has been read, it will be removed.
     */
    @Scheduled(cron = "0 0 * * * *") //Every hour.
    @Async
    public void cleanReadNotifications() {
        logService.logDebug(getClass(), "Cleaning Notifications...");

        if (!StartupService.isStarted()) {
            logService.logInfo(getClass(), "Skipping run since AptiBook is not started.");
            return;
        }

        int numNotificationsRemoved = 0;
        List<Tenant> tenants = tenantRepository.findAll();
        for (Tenant tenant : tenants) {
            List<Notification> notifications = notificationRepository.findAllForTenant(tenant);
            for (Notification notification : notifications) {
                if (notification.getRead() && Days.between(notification.getCreation(), ZonedDateTime.now()).getAmount() > 3) {
                    try {
                        notificationRepository.delete(notification);
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
