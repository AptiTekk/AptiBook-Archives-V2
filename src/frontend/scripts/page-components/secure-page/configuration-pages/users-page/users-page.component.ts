import {Component} from "@angular/core";

@Component({
    selector: 'users-page',
    templateUrl: 'users-page.component.html',
    styleUrls: ['users-page.component.css']
})
export class UsersPageComponent {

    horizontalLinks: [{icon: string, label: string, path: string[]}] = [
        {icon: 'user', label: 'All Users', path: ['', 'secure', 'configuration', 'users', 'all']},
        {icon: 'sitemap', label: 'User Groups', path: ['', 'secure', 'configuration', 'users', 'groups']}
    ];

}