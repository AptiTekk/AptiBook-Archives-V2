/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { ManagementComponent } from './management.component';
import {SharedModule} from "../../../shared/shared.module";
import {ApprovalModalComponent} from "./approval-modal/approval-modal.component";
import {ApprovalQueueComponent} from "./approval-queue/approval-queue.component";
import {ApprovedComponent} from "./approved/approved.component";
import {RejectedComponent} from "./rejected/rejected.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        ManagementComponent,
        ApprovalModalComponent,
        ApprovalQueueComponent,
        ApprovedComponent,
        RejectedComponent,
        CalendarComponent
    ],
    exports: [],
    providers: [],
})
export class ManagementModule { }
