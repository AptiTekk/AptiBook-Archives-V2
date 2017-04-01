/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var page_components_1 = require("../page-components");
var guards_1 = require("./guards");
var search_results_page_component_1 = require("../page-components/secure-page/search-results-page/search-results-page.component");
var search_guard_1 = require("./guards/search.guard");
var calendar_page_component_1 = require("../page-components/secure-page/management-pages/calendar-page/calendar-page.component");
var approval_queue_page_component_1 = require("../page-components/secure-page/management-pages/approval-queue-page/approval-queue-page.component");
var approved_page_component_1 = require("../page-components/secure-page/management-pages/approved-page/approved-page.component");
var rejected_page_component_1 = require("../page-components/secure-page/management-pages/rejected-page/rejected-page.component");
var management_container_component_1 = require("../page-components/secure-page/management-pages/management-container.component");
var reservation_details_page_component_1 = require("../page-components/secure-page/search-results-page/reservation-details-page/reservation-details-page.component");
var resources_page_component_1 = require("../page-components/secure-page/configuration-pages/resources-page/resources-page.component");
var success_page_component_1 = require("../page-components/secure-page/search-results-page/success-page/success-page.component");
var users_page_component_1 = require("../page-components/secure-page/configuration-pages/users-page/users-page.component");
var all_users_section_component_1 = require("../page-components/secure-page/configuration-pages/users-page/all-users-section/all-users-section.component");
var groups_section_component_1 = require("../page-components/secure-page/configuration-pages/users-page/groups-section/groups-section.component");
var inactive_tenant_page_1 = require("../page-components/inactive-tenant-page/inactive-tenant.page");
var register_success_component_1 = require("../page-components/front-page/register/success/register-success.component");
var properties_page_component_1 = require("../page-components/secure-page/configuration-pages/properties-page/properties-page.component");
exports.routes = router_1.RouterModule.forRoot([
    {
        path: 'secure',
        component: page_components_1.SecurePageComponent,
        children: [
            {
                path: 'dashboard',
                children: [
                    {
                        path: '',
                        component: page_components_1.DashboardPageComponent
                    },
                    {
                        path: 'upcoming',
                        component: page_components_1.DashboardPageComponent //TODO: New component
                    },
                    {
                        path: '**',
                        redirectTo: ''
                    }
                ]
            },
            {
                path: 'search-results',
                canActivate: [search_guard_1.SearchGuard],
                children: [
                    {
                        path: 'reservation-details',
                        component: reservation_details_page_component_1.ReservationDetailsComponent
                    },
                    {
                        path: 'success',
                        component: success_page_component_1.SuccessPageComponent
                    },
                    {
                        path: '**',
                        component: search_results_page_component_1.SearchResultsPageComponent
                    }
                ]
            },
            {
                path: 'my',
                children: [
                    {
                        path: 'account',
                        component: page_components_1.AccountPageComponent
                    },
                    {
                        path: 'notifications',
                        component: page_components_1.NotificationsPageComponent
                    },
                    {
                        path: '**',
                        redirectTo: 'account'
                    }
                ]
            },
            {
                path: 'configuration',
                children: [
                    {
                        path: 'resources',
                        component: resources_page_component_1.ResourcesPageComponent
                    },
                    {
                        path: 'resources/:resourceCategory',
                        component: resources_page_component_1.ResourcesPageComponent,
                    },
                    {
                        path: 'users',
                        component: users_page_component_1.UsersPageComponent,
                        children: [
                            {
                                path: '',
                                component: all_users_section_component_1.AllUsersSectionComponent
                            },
                            {
                                path: 'groups',
                                component: groups_section_component_1.GroupsSectionComponent
                            },
                            {
                                path: '**',
                                redirectTo: ''
                            }
                        ]
                    },
                    {
                        path: 'properties/:section',
                        component: properties_page_component_1.PropertiesPageComponent,
                    },
                    {
                        path: 'properties',
                        redirectTo: 'properties/personalization'
                    },
                    {
                        path: '**',
                        redirectTo: 'resources'
                    }
                ]
            },
            {
                path: 'management',
                component: management_container_component_1.ManagementContainerComponent,
                children: [
                    {
                        path: 'queue',
                        component: approval_queue_page_component_1.ApprovalQueuePageComponent
                    },
                    {
                        path: 'approved',
                        component: approved_page_component_1.ApprovedPageComponent
                    },
                    {
                        path: 'rejected',
                        component: rejected_page_component_1.RejectedPageComponent
                    },
                    {
                        path: 'calendar',
                        component: calendar_page_component_1.CalendarPageComponent
                    },
                    {
                        path: '**',
                        redirectTo: 'pending'
                    }
                ]
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ],
        canActivate: [guards_1.SecureGuard]
    },
    {
        path: 'inactive',
        component: inactive_tenant_page_1.InactiveTenantPage
    },
    {
        path: '',
        component: page_components_1.FrontPageComponent,
        children: [
            {
                path: 'sign-in',
                component: page_components_1.SignInComponent
            },
            {
                path: 'register',
                component: page_components_1.RegisterComponent,
            },
            {
                path: 'register/success',
                component: register_success_component_1.RegisterSuccessComponent
            },
            {
                path: '**',
                redirectTo: 'sign-in'
            }
        ],
        canActivate: [guards_1.FrontPageGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
]);
//# sourceMappingURL=routes.js.map