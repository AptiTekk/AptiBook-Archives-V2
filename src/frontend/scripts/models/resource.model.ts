import {ResourceCategory} from "./resource-category.model";
import {UserGroup} from "./user-group.model";
export interface Resource {
    id?: number;
    name?: string;
    needsApproval?: boolean;
    hasImage?: boolean;
    reservations?: any[];
    resourceCategory?: ResourceCategory;
    owner?: UserGroup;
}