import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../../services/singleton/user.service";
import {User} from "../../../../models/user.model";

@Component({
    selector: 'users-page',
    templateUrl: 'users-page.component.html',
    styleUrls: ['users-page.component.css']
})
export class UsersPageComponent implements OnInit {

    users: User[];

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService
            .getUsers()
            .subscribe(users => this.users = users.filter(user => !user.admin));
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Returns an array containing only the names of the user's UserGroups
     * @param user The User
     */
    protected getUserGroupsNames(user: User): string[] {
        return user.userGroups.map(userGroup => {
            return userGroup.name
        });
    }

}