import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, ReplaySubject} from "rxjs";
import {UserGroup} from "../../models/user-group.model";
import {AuthService} from "./auth.service";
import {User} from "../../models/user.model";

@Injectable()
export class UserGroupService {

    private rootUserGroup: ReplaySubject<UserGroup> = new ReplaySubject<UserGroup>(1);
    private user: User;
    private userGroupHierarchyDown: ReplaySubject<UserGroup[]> = new ReplaySubject<UserGroup[]>(1);

    constructor(private apiService: APIService, private authService: AuthService) {

    }

    public getUserGroupHierarchyDown(): ReplaySubject<UserGroup[]> {
        return this.userGroupHierarchyDown;
    }

    public getUserGroupHierarchyDownFilter() {
        this.authService.getUser().subscribe(user => this.user = user);
            this.apiService.get("/userGroups/hierarchyDown/" + this.user.id).subscribe(
                response =>
                    this.userGroupHierarchyDown.next(response),
                     err => this.userGroupHierarchyDown.next([]))
    }


    public patchUserGroup(userGroup: UserGroup): Observable<boolean> {
        return Observable.create(listener => {
            if (!userGroup)
                listener.next(false);
            else {
                this.apiService.patch("usersGroups/" + userGroup.id, userGroup).subscribe(
                    response => listener.next(true),
                    err => listener.next(false));
            }
        });
    }

    public reloadRootUserGroup(): void {
        this.apiService.get("/userGroups").subscribe(
            response => this.rootUserGroup.next(<UserGroup>response),
            err => this.rootUserGroup.next(undefined)
        )
    }

    public getRootUserGroup(): ReplaySubject<UserGroup> {
        return this.rootUserGroup;
    }

}