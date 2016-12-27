import {Component} from "@angular/core";
import {UserService} from "../../../../services/singleton/user.service";

@Component({
    selector: 'users-page',
    templateUrl: 'users-page.component.html',
    styleUrls: ['users-page.component.css']
})
export class UsersPageComponent {

    items: string[] = ["test", "test2", "test3"];
    otherStuff: number[] = [5,3,6];

    constructor(userService: UserService) {
    }

}