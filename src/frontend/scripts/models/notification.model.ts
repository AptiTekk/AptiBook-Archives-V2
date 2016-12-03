import Moment = moment.Moment;
import moment = require("moment");
export interface UnreadNotification{
    id: number;
    subject: string
    body: string
    creation: Moment
    read: boolean
}