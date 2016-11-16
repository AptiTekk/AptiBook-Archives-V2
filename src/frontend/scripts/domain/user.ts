export interface User {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    location: string;
    notifications;
    permissions;
    userGroups;
    admin: boolean;
}