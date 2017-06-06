/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */
import {Component} from "@angular/core";
import {HeaderComponent} from "../../../app/header/header.component";
import {NavigationLink} from "../../../shared/navigation/navigation-link.model";

@Component({
    selector: 'configuration',
    templateUrl: 'configuration.component.html'
})
export class ConfigurationComponent {

    navigationLinks: NavigationLink[] =
        [
            {
                path: ['', 'secure', 'configuration', 'resources'],
                label: "Resources",
                icon: "tags"
            },
            {
                path: ['', 'secure', 'configuration', 'users'],
                label: "Users",
                icon: "user"
            },
            {
                path: ['', 'secure', 'configuration', 'permissions'],
                label: "Permissions",
                icon: "unlock"
            },
            {
                path: ['', 'secure', 'configuration', 'properties'],
                label: "Properties",
                icon: "cog"
            }
        ];

}