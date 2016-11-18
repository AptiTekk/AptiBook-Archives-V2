export interface Reservation {
    id: number;
    dateCreated: string;
    title: string;
    status: string;
    startTime: string;
    endTime: string;
    resource: number;
    user: number;
    decisions: number[];
    fieldEntries: number[];
}