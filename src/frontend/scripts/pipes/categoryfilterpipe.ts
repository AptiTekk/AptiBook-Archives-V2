/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */


import {Pipe, PipeTransform} from "@angular/core";
import {Resource} from "../models/resource.model";
@Pipe({
    name: 'myfilter',
    pure: false
})
export class CategoryFilterPipe implements PipeTransform {


    transform(resources: any[], args: any[]): any {
        // filter items array, items which match and return true will be kept, false will be filtered out
        resources.filter(resource => {
            args.forEach(c => {
                if(resource.resourceCategory.name == c.name && c.on == true) {
                    console.log("got here");
                    return true;
                }
                else {
                    console.log("nope");
                    return false;
                }
            });

console.log("size: " + resources.length);
return resources;
            /*this.resource = resource;
             args.forEach(c =>
             {if(c.name == this.resource.name && c.on == true){
             return true;
             }else{return false;}}
             );
             }*/
        });
    }
}