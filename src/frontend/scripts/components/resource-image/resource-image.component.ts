/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, Input} from "@angular/core";
import {Resource} from "../../models/resource.model";
import {APIService} from "../../services/singleton/api.service";

@Component({
    selector: 'resource-image',
    templateUrl: 'resource-image.component.html'
})
export class ResourceImageComponent {

    noImageUrl: string = "/static/resource-no-image.jpg";

    @Input() resource: Resource;

    @Input() maxWidth: string;

    @Input() width: string;

    constructor(protected apiService: APIService) {

    }

}