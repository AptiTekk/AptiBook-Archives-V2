import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";

@Injectable()
export class TagService {

    constructor(private apiService: APIService) {

    }

    getTags(): Observable<any> {
        return this.apiService.get("/tags");
    }

    addTag(tag: Object): Observable<any> {
        return this.apiService.post("/tags", tag);
    }

    deleteTag(tag: Object): Observable<any> {
        if (tag['id'] === undefined)
            return undefined;

        return this.apiService.remove("/tags/" + tag['id']);
    }

}