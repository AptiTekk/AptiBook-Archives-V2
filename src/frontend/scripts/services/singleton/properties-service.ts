

import {Injectable} from "@angular/core";
import {APIService} from "./api.service";
import {Observable} from "rxjs";
import {Property} from "../../models/properties.model";
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

    public patchProperty(property: Property){
        return Observable.create(listener =>{
            this.apiService.patch("properties/" + property.id, property).subscribe(
                response => listener.next(response),
                err => listener.error(err)
            )
        })
    }
}