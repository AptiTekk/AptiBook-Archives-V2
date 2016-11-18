export interface Reservation {
    id: number;
    dateCreated: string;
    title: string;
    status: string;
    start: string;
    end: string;
    resource: number;
    user: number;
    decisions: number[];
    fieldEntries: number[];
}