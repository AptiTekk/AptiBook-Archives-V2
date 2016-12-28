import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Resource} from "../../models/resource.model";
import {Observable} from "rxjs";
import {ResourceCategory} from "../../models/resource-category.model";
import {UserGroup} from "../../models/user-group.model";
import Moment = moment.Moment;
import moment = require("moment");

@Injectable()
export class ResourceService {

    constructor(private apiService: APIService) {
    }

    fetchAvailableResources(start: Moment, end: Moment): Observable<Resource[]> {
        return Observable.create(listener => {
            this.apiService
                .get("/resources/available?start=" + start.clone().utc().format("YYYY-MM-DDTHH:mm") + "&end=" + end.clone().utc().format("YYYY-MM-DDTHH:mm"))
                .subscribe(
                    resources => listener.next(<Resource[]>resources),
                    err => listener.next(undefined));
        });
    }

    addNewResource(resourceCategory: ResourceCategory, name: string, needsApproval: boolean, owner: UserGroup): Observable<Resource> {
        return Observable.create(listener => {
            this.apiService
                .post("/resources", {name, needsApproval, owner, resourceCategory})
                .subscribe(
                    resources => listener.next(<Resource>resources),
                    err => listener.next(undefined));
        });
    }

    patchResource(resource: Resource): Observable<Resource> {
        return Observable.create(listener => {
            this.apiService
                .patch("/resources/" + resource.id, resource)
                .subscribe(
                    response => listener.next(response),
                    err => listener.next(undefined)
                )
        })
    }

    deleteResource(resource: Resource): Observable<boolean> {
        return Observable.create(listener => {
            this.apiService
                .del("/resources/" + resource.id)
                .subscribe(
                    response => listener.next(true),
                    err => listener.next(false)
                )
        });
    }

}