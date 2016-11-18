import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {ReplaySubject} from "rxjs";
import {Tenant} from "../models/tenant.model";

@Injectable()
export class TenantService {

    private tenant: ReplaySubject<Tenant> = new ReplaySubject<Tenant>(1);

    constructor(private apiService: APIService) {
        apiService.get("tenant").subscribe(
            response => this.tenant.next(<Tenant>response),
            err => this.tenant = undefined
        );
    }

    getTenant(): ReplaySubject<Tenant> {
        return this.tenant;
    }

}