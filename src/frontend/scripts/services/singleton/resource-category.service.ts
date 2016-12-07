import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {User} from "../../models/user.model";
import {AuthService} from "./auth.service";
import {APIService} from "./api.service";
import {ResourceCategory} from "../../models/resource-category.model";

@Injectable()
export class ResourceCategoryService {
    private resourceCategories: ReplaySubject<ResourceCategory[]> = new ReplaySubject<ResourceCategory[]>(1);

    constructor(private authService: AuthService, private apiService: APIService) {
        this.fetchResourceCategories();
    }

    fetchResourceCategories() {
        this.apiService.get("/resourceCategories").subscribe(
            response => this.resourceCategories.next(<ResourceCategory[]>response),
            err => this.resourceCategories.next(undefined));
    }

    getResourceCategories() {
        return this.resourceCategories;
    }

}