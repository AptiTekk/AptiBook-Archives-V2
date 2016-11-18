import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable, ReplaySubject} from "rxjs";
import {isNullOrUndefined} from "util";
import {UserGroup} from "../models/user-group.model";

@Injectable()
export class UserGroupService {

    private rootUserGroup: ReplaySubject<UserGroup> = new ReplaySubject<UserGroup>(1);

    constructor(private apiService: APIService) {
        this.reloadRootUserGroup();
    }

    public patchUserGroup(userGroup: UserGroup): Observable<boolean> {
        return Observable.create(listener => {
            if (isNullOrUndefined(userGroup))
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