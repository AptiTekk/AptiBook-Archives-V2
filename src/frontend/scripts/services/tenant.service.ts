import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";

@Injectable()
export class TenantService {

    private tenant: ReplaySubject<any> = new ReplaySubject(1);

    constructor(private apiService: APIService) {
        apiService.get("tenant").subscribe(
            response => this.tenant.next(response),
            err => this.tenant = undefined
        );
    }

    getTenant(): ReplaySubject<any> {
        return this.tenant;
    }

}