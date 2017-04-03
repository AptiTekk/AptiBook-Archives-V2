/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {NgModule} from "@angular/core";
import {AccordionComponent} from "./accordion/accordion.component";
import {AccordionItemComponent} from "./accordion/accordion-item/accordion-item.component";
import {AccordionNavigationComponent} from "./accordion-navigation/accordion-navigation.component";
import {AlertComponent} from "./alert/alert.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {CalendarHeaderComponent} from "./calendar/calendar-header/calendar-header.component";
import {DataTableComponent} from "./datatable/datatable.component";
import {DataTableCell} from "./datatable/datatable-cell/datatable-cell.component";
import {DataTableColumnComponent} from "./datatable/datatable-column/datatable-column.component";
import {DateTimePickerComponent} from "./date-time-picker/date-time-picker.component";
import {DeletionConfirmationModalComponent} from "./deletion-confirmation-modal/deletion-confirmation-modal.component";
import {FormGroupComponent} from "./form-group/form-group.component";
import {ImageUploaderComponent} from "./image-uploader/image-uploader.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {NavigationLinkComponent} from "./navigation/navigation-link.component";
import {PanelComponent} from "./panel/panel.component";
import {PanelBodyComponent} from "./panel/panel-body/panel-body.component";
import {PanelFooterComponent} from "./panel/panel-footer/panel-footer.component";
import {ReservationInfoModalComponent} from "./reservation-info-modal/reservation-info-modal.component";
import {ResourceImageComponent} from "./resource-image/resource-image.component";
import {ToggleSwitchComponent} from "./toggle-switch/toggle-switch.component";
import {TreeComponent} from "./tree/tree.component";
import {TreeNodeComponent} from "./tree/tree-node/tree-node.component";
import {UserImageComponent} from "./user-image/user-image.component";
import {ImageUploaderModule} from "./image-uploader/image-uploader.module";
import {ModalModule} from "./modal/modal.module";
import {ConfirmationModalComponent} from "./confirmation-modal/confirmation-modal.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

/**
 * This module is dedicated to highly re-usable components that are used often in feature components (pages, etc)
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ImageUploaderModule,
        ModalModule
    ],
    declarations: [
        AccordionComponent, //TODO: make module
        AccordionItemComponent,
        AccordionNavigationComponent,
        AlertComponent,
        CalendarComponent,
        CalendarHeaderComponent, //TODO: make module
        ConfirmationModalComponent,
        DataTableComponent,
        DataTableCell,
        DataTableColumnComponent, //TODO: make module
        DateTimePickerComponent,
        DeletionConfirmationModalComponent,
        FormGroupComponent,
        NavigationComponent,
        NavigationLinkComponent, //TODO: Make module
        PanelComponent,
        PanelBodyComponent,
        PanelFooterComponent, //TODO: Make module
        ReservationInfoModalComponent,
        ResourceImageComponent,
        ToggleSwitchComponent,
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
        ImageUploaderModule,
        ModalModule,

        // Components
        AccordionComponent, //TODO: make module
        AccordionItemComponent,
        AccordionNavigationComponent,
        AlertComponent,
        CalendarComponent,
        CalendarHeaderComponent, //TODO: make module
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
        PanelComponent,
        PanelBodyComponent,
        PanelFooterComponent, //TODO: Make module
        ReservationInfoModalComponent,
        ResourceImageComponent,
        ToggleSwitchComponent,
        TreeComponent,
        TreeNodeComponent, //TODO: Make Module
        UserImageComponent
    ],
    providers: [],
})
export class SharedModule {
}
