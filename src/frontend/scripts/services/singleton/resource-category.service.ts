import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {UserService} from "./user.service";
import {User} from "../../models/user.model";
import {AuthService} from "./auth.service";
import {APIService} from "./api.service";
import {ResourceCategory} from "../../models/resource-category.model";

@Injectable()
export class ResourceCategoryService{
    private resourceCategory: ReplaySubject<ResourceCategory[]> = new ReplaySubject<ResourceCategory[]>(1);
    private user: User;


    constructor(private authService: AuthService, private apiService: APIService){
               /*  authService.getUser().subscribe(user => {
                     if(user != undefined){
                         this.user = user;
                         this.getResourceCategories();
                     }
                 });
*/
               this.getResourceCategories();
    }
    getResourceCategories(){
        this.apiService.get("/resourceCategories").subscribe(
            response => this.resourceCategory.next(<ResourceCategory[]>response),
            err => this.resourceCategory.next(undefined));
    }

    getResourceCategory(){
        console.log("called getter");
        return this.resourceCategory;
    }

}