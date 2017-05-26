/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Injectable} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {ATAnalyticsEvent} from "../../shared/analytics/analytics-event.model";

declare const ga: Function;

@Injectable()
export class AnalyticsService {

    /**
     * Determines if the Tenant has opted out of tracking.
     * TODO: Implement a way to make this true.
     */
    private static optedOut = false;

    constructor(private router: Router) {
        // Automatically send pageview requests upon route changes
        this.router.events.distinctUntilChanged((previous: any, current: any) => {
            if (current instanceof NavigationEnd) {
                return previous.url === current.url;
            }
            return true;
        }).subscribe((x: any) => {
            if (!AnalyticsService.optedOut) {
                ga('set', 'page', x.url);
                ga('send', 'pageview');
            }
        });
    }

    /**
     * Sends an event to Google for tracking.
     * @param analyticsEvent The event data.
     */
    public static sendEvent(analyticsEvent: ATAnalyticsEvent): void {
        if (!AnalyticsService.optedOut) {
            ga('send', 'event', analyticsEvent.category, analyticsEvent.action, analyticsEvent.label, analyticsEvent.value);
        }
    }

}