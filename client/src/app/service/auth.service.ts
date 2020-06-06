
import { Injectable } from '@angular/core';
import { IUser } from '../user/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProfileService } from './profile.service';


@Injectable()
export class AuthService {
    private serverUrl = environment.serverUrl;
    constructor( private http: HttpClient,
                 private profileService: ProfileService) {
    }
    currentUser: IUser = {
        firstName: '',
        lastName: '',
        userName: '',
        telNo: ''
    };
    updateUser: IUser = {
        firstName: '',
        lastName: '',
        userName: '',
        telNo: ''
    };
    isLogin = false;

    public adminList = ['admin', 'krittiya22', 'superadmin'];
    public superAdminList = ['krittiya22', 'superadmin'];
    loginUser(userName: string, password: string) {
        this.http.post<any>(this.serverUrl + '/get-user', {userName, password}).subscribe(user => {
        if (user.data.length === 0) {
            alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        } else {
            this.isLogin = true;
            this.currentUser = {
                firstName: user.data[0].firstName,
                lastName: user.data[0].lastName,
                userName,
                telNo: user.data[0].telNo
                };
            }
    });
    }

    updateCurrentUser(userName: string, firstName: string, lastName: string, telNo: string) {
        this.updateUser.userName = userName;
        this.updateUser.firstName = firstName;
        this.updateUser.lastName = lastName;
        this.updateUser.telNo = telNo;
        this.http.post<any>(this.serverUrl + '/update-user', this.updateUser).subscribe(user => {
            if (this.profileService.isCurrentUser) {
                this.currentUser.firstName = this.updateUser.firstName;
                this.currentUser.lastName = this.updateUser.lastName;
                this.currentUser.telNo = this.updateUser.telNo;
            }
        });
    }

    changePassword(oldPassword: string, newPassword: string, userName: string) {
        const passwordData = {oldPassword: '',
                              newPassword: '',
                              userName: ''};
        passwordData.oldPassword = oldPassword;
        passwordData.newPassword = newPassword;
        passwordData.userName = userName;
        this.http.post<any>(this.serverUrl + '/change-password', passwordData).subscribe(user => {
            if (user.status === 'False') {
                alert('กรุณาระบุรหัสผ่านเดิมให้ถูกต้อง');
            }
            alert('แก้ไขรหัสผ่านสำเร็จ');
        });
    }

    isAuthenticated() {
        return this.currentUser.userName !== '' ? true : false;
    }

    isAdmin() {
        if (this.adminList.includes(this.currentUser.userName)) {
            return true;
        } else {
            return false;
        }
    }

    isSuperAdmin() {
        if (this.superAdminList.includes(this.currentUser.userName)) {
            return true;
        } else {
            return false;
        }
    }

    logout() {
        this.currentUser = {
            firstName: '',
            lastName: '',
            userName: '',
            telNo: ''
        };
    }
}
