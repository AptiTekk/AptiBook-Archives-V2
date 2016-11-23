export interface UserGroup {
    id: number;
    name: string;
    root: boolean;
    users: number[];
    parent: number[];
    children: UserGroup[];
}