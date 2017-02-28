

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";
@Injectable()
export class PropertiesService{
    constructor(private apiService: APIService){

    }

    public getAllProperties(){
        return Observable.create(listener =>{
            this.apiService.get("properties").subscribe(
                response => listener.next(response),
                err => listener.err(err)
            )
        });
    }
}