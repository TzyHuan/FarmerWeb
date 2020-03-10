export class Member {
    account: string;
    firstName: string;
    lastName?: string;
    domain?: string;
    password?: string;
    email?: string;
    isActive: boolean;
    addTime?: Date;
    updatedTime?: Date;
}
