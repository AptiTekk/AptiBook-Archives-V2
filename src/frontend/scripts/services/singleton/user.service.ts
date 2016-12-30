import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {User} from "../../models/user.model";
import {Observable, ReplaySubject} from "rxjs";

@Injectable()
export class UserService {

    users: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

    constructor(private apiService: APIService) {
        this.fetchUsers();
    }

    public fetchUsers() {
        this.apiService
            .get("/users")
            .take(1)
            .subscribe(
                response => this.users.next(response),
                err => this.users.next(undefined)
            )
    }

    public getUsers(): ReplaySubject<User[]> {
        return this.users;
    }

    public patchUser(user: User, passwordOnly: boolean = false): Observable<boolean> {
        return Observable.create(listener => {
            if (!user)
                listener.next(false);
            else {
                this.apiService
                    .patch("users/" + user.id + (passwordOnly ? "?passwordOnly=true" : ""), user)
                    .subscribe(
                        response => listener.next(true),
                        err => listener.next(false)
                    );
            }
        });
    }

    public deleteUser(user: User): Observable<boolean> {
        return Observable.create(listener => {
            if (!user)
                listener.next(false);
            else {
                this.apiService
                    .del("users/" + user.id)
                    .subscribe(
                        response => listener.next(true),
                        err => listener.next(false)
                    );
            }
        });
    }
}