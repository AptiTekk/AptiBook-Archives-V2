/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services;

import com.aptitekk.aptibook.core.domain.entities.Tenant;
import com.aptitekk.aptibook.core.services.tenant.TenantManagementService;
import com.mindscapehq.raygun4java.core.RaygunClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Scope("prototype")
public class LogService {

    /**
     * The logger being used for this application.
     */
    private Logger LOGGER = LoggerFactory.getLogger(LogService.class);

    /**
     * The Raygun API Key, for reporting exceptions to Raygun.
     */
    private static final String RAYGUN_API_KEY = System.getenv("RAYGUN_APIKEY");

    /**
     * The Raygun client, generated using the RAYGUN_API_KEY.
     */
    private static final RaygunClient RAYGUN_CLIENT = RAYGUN_API_KEY != null ? new RaygunClient(RAYGUN_API_KEY) : null;

    private final SpringProfileService springProfileService;
    private final AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Autowired
    public LogService(SpringProfileService springProfileService,
                      AutowireCapableBeanFactory autowireCapableBeanFactory) {
        this.springProfileService = springProfileService;
        this.autowireCapableBeanFactory = autowireCapableBeanFactory;
    }


    /**
     * Gets the current Tenant by using programmatic bean injection to avoid a circular dependency loop.
     *
     * @return The current Tenant, or null if there is none.
     */
    private Tenant getCurrentTenant() {
        TenantManagementService tenantManagementService = new TenantManagementService();
        this.autowireCapableBeanFactory.autowireBean(tenantManagementService);
        return tenantManagementService.getTenant();
    }

    /**
     * Logs an info message to the console.
     *
     * @param clazz   The class that invoked the info message, for logging purposes.
     * @param message The message to log.
     */
    public void logInfo(Class clazz, String message) {
        Tenant currentTenant = getCurrentTenant();
        LOGGER.info("[" + clazz.getSimpleName() + "] " + (currentTenant != null ? "[Tenant: " + currentTenant.domain + "] " : "") + message);
    }

    /**
     * Logs an error message to the console.
     *
     * @param clazz   The class that invoked the error message, for logging purposes.
     * @param message The message to log.
     */
    public void logError(Class clazz, String message) {
        Tenant currentTenant = getCurrentTenant();
        LOGGER.error("[" + clazz.getSimpleName() + "] " + (currentTenant != null ? "[Tenant: " + currentTenant.domain + "] " : "") + message);
    }

    /**
     * Logs an exception and message to the console, and sends the exception to Raygun.
     *
     * @param clazz   The class that is reporting the exception, for logging purposes.
     * @param t       The throwable that is being reported.
     * @param message The message to log.
     */
    public void logException(Class clazz, Throwable t, String message) {
        Tenant currentTenant = getCurrentTenant();
        LOGGER.error("[" + clazz.getSimpleName() + "] " + (currentTenant != null ? "[Tenant: " + currentTenant.domain + "] " : "") + message, t);
        if (RAYGUN_CLIENT != null && springProfileService.isProfileActive(SpringProfileService.Profile.PRODUCTION)) {
            List<String> tags = new ArrayList<>();
            //TODO: tags.add("V. " + AptiBookInfoProvider.getVersion());

            // Add the current Tenant's specific tag.
            tags.add("Tenant:" + (currentTenant != null ? currentTenant.domain : "Unknown"));
            tags.add(clazz.getSimpleName());

            // Add the message as data.
            Map<String, String> data = new HashMap<>();
            data.put("message", message);

            // Send the error to Raygun.
            RAYGUN_CLIENT.Send(t, tags, data);
        }
    }

    /**
     * Logs a debug message to the console.
     *
     * @param clazz   The class that invoked the debug message, for logging purposes.
     * @param message The message to log.
     */
    public void logDebug(Class clazz, String message) {
        Tenant currentTenant = getCurrentTenant();
        LOGGER.debug("[" + clazz.getSimpleName() + "] " + (currentTenant != null ? "[Tenant: " + currentTenant.domain + "] " : "") + message);
    }

}
