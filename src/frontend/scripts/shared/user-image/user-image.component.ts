/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component, Input} from "@angular/core";
import {User} from "../../models/user.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
    selector: 'user-image',
    templateUrl: 'user-image.component.html'
})
export class UserImageComponent {

    noImagePlaceholder: SafeUrl = this.santizer.bypassSecurityTrustUrl(require("!url-loader!../../../resources/user-no-image.svg"));

    @Input() user: User;

    @Input() maxWidth: string;

    @Input() width: string;

    constructor(private santizer: DomSanitizer) {
    }

}