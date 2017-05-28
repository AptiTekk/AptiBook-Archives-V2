/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {AlertComponent} from "./alert/alert.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {DataTableComponent} from "./datatable/datatable.component";
import {DataTableCell} from "./datatable/datatable-cell/datatable-cell.component";
import {DataTableColumnComponent} from "./datatable/datatable-column/datatable-column.component";
import {DateTimePickerComponent} from "./date-time-picker/date-time-picker.component";
import {DeletionConfirmationModalComponent} from "./deletion-confirmation-modal/deletion-confirmation-modal.component";
import {FormGroupComponent} from "./form-group/form-group.component";
import {ImageUploaderComponent} from "./image-uploader/image-uploader.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {NavigationLinkComponent} from "./navigation/navigation-link.component";
import {ReservationInfoModalComponent} from "./reservation-info-modal/reservation-info-modal.component";
import {ResourceImageComponent} from "./resource-image/resource-image.component";
import {TreeComponent} from "./tree/tree.component";
import {TreeNodeComponent} from "./tree/tree-node/tree-node.component";
import {UserImageComponent} from "./user-image/user-image.component";
import {ImageUploaderModule} from "./image-uploader/image-uploader.module";
import {ModalModule} from "./modal/modal.module";
import {ConfirmationModalComponent} from "./confirmation-modal/confirmation-modal.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CardModule} from "./card/card.module";
import {CheckboxModule} from "./checkbox/checkbox.module";
import {AnalyticsModule} from "./analytics/analytics.module";

/**
 * This module is dedicated to highly re-usable components that are used often in feature components (pages, etc)
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        // Component modules
        AnalyticsModule,
        CardModule,
        CheckboxModule,
        ImageUploaderModule,
        ModalModule,
    ],
    declarations: [
        AlertComponent,
        CalendarComponent,
        ConfirmationModalComponent,
        DataTableComponent,
        DataTableCell,
        DataTableColumnComponent, //TODO: make module
        DateTimePickerComponent,
        DeletionConfirmationModalComponent,
        FormGroupComponent,
        NavigationComponent,
        NavigationLinkComponent, //TODO: Make module
        ReservationInfoModalComponent,
        ResourceImageComponent,
        TreeComponent,
        TreeNodeComponent, //TODO: Make Module
        UserImageComponent
    ],
    exports: [
        // Common modules used throughout the application
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        // Component modules
        AnalyticsModule,
        CardModule,
        CheckboxModule,
        ImageUploaderModule,
        ModalModule,

        // Components
        AlertComponent,
        CalendarComponent,
        ConfirmationModalComponent,
        DataTableComponent,
        DataTableCell,
        DataTableColumnComponent, //TODO: make module
        DateTimePickerComponent,
        DeletionConfirmationModalComponent,
        FormGroupComponent,
        ImageUploaderComponent,
        NavigationComponent,
        NavigationLinkComponent, //TODO: Make module
        ReservationInfoModalComponent,
        ResourceImageComponent,
        TreeComponent,
        TreeNodeComponent, //TODO: Make Module
        UserImageComponent
    ],
    providers: [],
})
export class SharedModule {
}
