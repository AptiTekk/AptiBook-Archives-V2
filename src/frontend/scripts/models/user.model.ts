import {UserGroup} from "./user-group.model";
export interface User {
    id: number;

    emailAddress: string;

    firstName: string;
    lastName: string;
    fullName: string;

    phoneNumber: string;
    location: string;

    notifications;
    notificationTypeSettings;

    permissions;
    userGroups: UserGroup[];
    admin: boolean;

    newPassword: string;
    confirmPassword: string;
}