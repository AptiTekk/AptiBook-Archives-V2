import {Resource} from "./resource.model";
export interface Reservation {
    id: number;

    dateCreated: string;

    title: string;
    status: string;

    start: string;
    end: string;

    resource: Resource;
    user: number;
    decisions: number[];
    fieldEntries: number[];

    pending: boolean;
    approved: boolean;
    rejected: boolean;
    cancelled: boolean;
}