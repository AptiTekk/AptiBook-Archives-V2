import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";

@Injectable()
export class TenantService {

    constructor(private apiService: APIService){}

    getTenant(): Observable<any> {
        return this.apiService.get("tenant");
    }

}