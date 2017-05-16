/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ManagementComponent} from "./management.component";
import {ApprovalQueueComponent} from "./approval-queue/approval-queue.component";
import {ApprovedComponent} from "./approved/approved.component";
import {RejectedComponent} from "./rejected/rejected.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {ManagementGuard} from "./management.guard";

const routes: Routes = [
    {
        path: '',
        component: ManagementComponent,
        canActivate: [ManagementGuard],
        children: [
            {
                path: 'queue',
                component: ApprovalQueueComponent
            },
            {
                path: 'approved',
                component: ApprovedComponent
            },
            {
                path: 'rejected',
                component: RejectedComponent
            },
            {
                path: 'calendar',
                component: CalendarComponent
            },
            {
                path: '**',
                redirectTo: 'queue'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        ManagementGuard
    ]
})
export class ManagementRoutesModule {
}