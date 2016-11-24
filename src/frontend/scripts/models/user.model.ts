export class User {
    id: number;

    emailAddress: string;

    firstName: string;
    lastName: string;
    fullName: string;

    phoneNumber: string;
    location: string;

    notifications: number[] = [];
    notificationTypeSettings;

    permissions;
    userGroups: number[] = [];
    admin: boolean;

    /**
     * New Password - not sent by server, but is accepted by server.
     */
    newPassword: string;

    /**
     * Confirmation password - for client use only, not sent or accepted by server.
     */
    confirmPassword: string;
}