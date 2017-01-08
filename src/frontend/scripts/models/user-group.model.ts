import {User} from "./user.model";
export interface UserGroup {
    id: number;
    name: string;
    root: boolean;
    users: User[];
    parent: UserGroup[];
    children: UserGroup[];
}