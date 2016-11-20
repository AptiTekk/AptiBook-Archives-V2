export interface Resource {
    id: number;
    name: string;
    needsApproval: boolean;
    reservations: number[];
    resourceCategory: number;
    owner: number;
}