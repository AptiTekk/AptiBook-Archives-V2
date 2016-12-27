/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, Input, ContentChildren, QueryList} from "@angular/core";
import {DataTableCell} from "../datatable-cell/datatable-cell.component";

@Component({
    selector: 'datatable-column',
    template: ''
})
export class DataTableColumn {

    @Input() public title: string;

    @ContentChildren(DataTableCell) public cells: QueryList<DataTableCell>;

}