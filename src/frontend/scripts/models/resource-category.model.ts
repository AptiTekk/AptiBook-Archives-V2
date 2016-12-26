import {Resource} from "./resource.model";
export interface ResourceCategory {
    id: number;
    name: string;
    resources: Resource[];
}