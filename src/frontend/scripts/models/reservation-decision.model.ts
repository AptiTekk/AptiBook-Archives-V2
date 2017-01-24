import {User} from "./user.model";
import {UserGroup} from "./user-group.model";
import {Reservation} from "./reservation.model";
export interface ReservationDecision{
    id: Number;
    user: User;
    userGroup: UserGroup;
    reservation: Reservation;
    approved: boolean;
    comment: String;
}