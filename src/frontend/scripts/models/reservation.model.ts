import {Resource} from "./resource.model";
import {User} from "./user.model";
import moment = require("moment");
import Moment = moment.Moment;
export interface Reservation {
    id: number;

    dateCreated: string;

    title: string;
    status: string;

    start: Moment;
    end: Moment;

    resource: Resource;
    user: User;
    decisions: number[];
    fieldEntries: number[];

    pending: boolean;
    approved: boolean;
    rejected: boolean;
    cancelled: boolean;
}