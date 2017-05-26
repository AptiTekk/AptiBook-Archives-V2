/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {ATAnalyticsEvent} from "../../shared/analytics/analytics-event.model";
import {PropertiesService} from "./properties-service";

declare const ga: Function;

@Injectable()
export class AnalyticsService {

    /**
     * Determines if the Tenant has opted out of tracking.
     */
    private static enabled = true;

    constructor(private router: Router,
                private propertiesService: PropertiesService) {

        // Check if Analytics are enabled.
        this.propertiesService.getProperty("ANALYTICS_ENABLED")
            .then((value: boolean) => {
                AnalyticsService.setAnalyticsEnabled(value);

                // Automatically send pageview requests upon route changes
                this.router.events.distinctUntilChanged((previous: any, current: any) => {
                    if (current instanceof NavigationEnd) {
                        return previous.url === current.url;
                    }
                    return true;
                }).subscribe((x: any) => {
                    if (AnalyticsService.enabled) {
                        ga('set', 'page', x.url);
                        ga('send', 'pageview');
                    }
                });
            })
            .catch(err => {
                console.log("Analytics are disabled due to an inability to determine the status.");
                AnalyticsService.setAnalyticsEnabled(false);
            });
    }

    /**
     * Changes whether Analytics are enabled or not.
     * @param enabled True if Analytics should be sent.
     */
    public static setAnalyticsEnabled(enabled: boolean) {
        AnalyticsService.enabled = enabled;
        window['ga-disable-UA-46481658-2'] = !enabled;
    }

    /**
     * Sends an event to Google for tracking.
     * @param analyticsEvent The event data.
     */
    public static sendEvent(analyticsEvent: ATAnalyticsEvent): void {
        if (AnalyticsService.enabled) {
            ga('send', 'event', analyticsEvent.category, analyticsEvent.action, analyticsEvent.label, analyticsEvent.value);
        }
    }

}