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
        let filteredResources: Resource[] = [];
        for(let arg of args){
            resources.forEach(resource =>{
                if(resource.resourceCategory.name === arg.name && arg.on == true){
                    filteredResources.push(resource);
                }
            })
        }
        if(filteredResources != undefined) {
            console.log("Size: " + filteredResources.length);
        }
        return filteredResources;
       /* let filteredResources: Resource[] =[];
        for(let arg of args){
            resources = resources.filter(resource => {
                if(resource.resourceCategory.name === arg.name && arg.on){
                    console.log("is true");
                    filteredResources.push(resource);
                    return false;
                }else{
                    console.log("is false");
                    return true;
                }
            })
        }
        if(filteredResources != null) {
            console.log("size: " + filteredResources.length);
        }
        return filteredResources;
    }*/
/*        // filter items array, items which match and return true will be kept, false will be filtered out
        resources = resources.filter(resource => {
            args.forEach(c => {
                if(resource.resourceCategory.name == c.name && c.on == true) {
                    console.log("got here man");
                    return false;
                }
                else {
                    console.log("nope");
                    return true;
                }
            });

console.log("size: " + resources.length);
return resources;
            /!*this.resource = resource;
             args.forEach(c =>
             {if(c.name == this.resource.name && c.on == true){
             return true;
             }else{return false;}}
             );
             }*!/
        });
    }*/
}