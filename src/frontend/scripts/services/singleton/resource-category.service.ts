import {Injectable} from "@angular/core";
import {ReplaySubject, Observable} from "rxjs";
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

    addNewResourceCategory(name: string): Observable<ResourceCategory> {
        return Observable.create(listener => {
            this.apiService.post("/resourceCategories", {name: name}).subscribe(
                response => listener.next(response),
                err => listener.next(undefined)
            )
        });
    }

    patchResourceCategory(category: ResourceCategory): Observable<ResourceCategory> {
        return Observable.create(listener => {
            this.apiService.patch("/resourceCategories/" + category.id, category).subscribe(
                response => listener.next(response),
                err => listener.next(undefined)
            )
        });
    }

    deleteResourceCategory(category: ResourceCategory): Observable<boolean> {
        return Observable.create(listener => {
            this.apiService.del("/resourceCategories/" + category.id).subscribe(
                response => listener.next(true),
                err => listener.next(false)
            )
        });
    }

}