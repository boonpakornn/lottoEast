import { Injectable } from '@angular/core';
import { IUser } from '../user/user.model';

@Injectable()
export class ProfileService {
    constructor() {
    }
    editUser: IUser = {
        firstName: '',
        lastName: '',
        userName: '',
        telNo: ''
    };
    isCurrentUser = false;

    updateEditUser(editUser) {
        this.editUser = {
            firstName: editUser.firstName,
            lastName: editUser.lastName,
            userName: editUser.userName,
            telNo: editUser.telNo
            };
        }
}
