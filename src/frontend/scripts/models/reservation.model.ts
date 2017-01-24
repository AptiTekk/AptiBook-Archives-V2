import {Resource} from "./resource.model";
import {User} from "./user.model";
import {UserGroupWithDecision} from "./user-group.model";
import moment = require("moment");
import Moment = moment.Moment;

export interface Reservation {

    id: number;

    dateCreated: string;

    title: string;
    status: string;

    start: string;
    end: string;

    resource: Resource;
    user: User;
    fieldEntries: number[];

    pending: boolean;
    approved: boolean;
    rejected: boolean;
    cancelled: boolean;

}

export interface ReservationWithDecisions extends Reservation {

    hierarchy?: UserGroupWithDecision[];

}