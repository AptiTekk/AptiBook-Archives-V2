/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, Input} from "@angular/core";
import {APIService} from "../../services/singleton/api.service";
import {User} from "../../models/user.model";

@Component({
    selector: 'user-image',
    templateUrl: 'user-image.component.html'
})
export class UserImageComponent {

    noImageUrl: string = "/static/user-no-image.svg";

    @Input() user: User;

    @Input() maxWidth: string;

    @Input() width: string;

    constructor(protected apiService: APIService) {

    }

}