/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import { NgModule } from '@angular/core';

import { GroupsComponent } from './groups.component';
import {SharedModule} from "../../../../../components/shared.module";
import {NewGroupModalComponent} from "./new-group-modal/new-group-modal.component";

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        GroupsComponent,
        NewGroupModalComponent
    ],
    exports: [],
    providers: [],
})
export class GroupsModule { }
