/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {LoaderService} from "../../core/services/loader.service";

@Component({
    selector: 'loader',
    templateUrl: 'loader.component.html',
    styleUrls: ['loader.component.css']
})
export class LoaderComponent {

    loading: boolean;

    constructor(loaderService: LoaderService) {
        loaderService.isLoading().subscribe(loading => this.loading = loading);
    }

}