/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

import {Component} from "@angular/core";
import {NavigationLink} from "../../../../shared/navigation/navigation-link.model";

@Component({
    selector: 'at-configuration-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.css']
})
export class UsersConfigurationComponent {

    sectionLinks: NavigationLink[] = [
        {icon: 'user', label: 'All Users', path: ['', 'secure', 'configuration', 'users'], exact: true},
        {icon: 'sitemap', label: 'User Groups', path: ['', 'secure', 'configuration', 'users', 'groups']}
    ];

}