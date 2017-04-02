/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'modal-body',
    template: `<ng-content></ng-content>`
})
export class ModalBodyComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}