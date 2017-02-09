/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {NavigationLink} from "../../../../components/navigation/navigation-link.model";

@Component({
    selector: 'users-page',
    templateUrl: 'users-page.component.html',
    styleUrls: ['users-page.component.css']
})
export class UsersPageComponent {

    sectionLinks: NavigationLink[] = [
        {icon: 'user', label: 'All Users', path: ['', 'secure', 'configuration', 'users'], exact: true},
        {icon: 'sitemap', label: 'User Groups', path: ['', 'secure', 'configuration', 'users', 'groups']}
    ];

}