
import { Injectable } from '@angular/core';
import { IUser } from './user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthService {
    private serverUrl = environment.serverUrl;
    constructor( private http: HttpClient) {

    }
    currentUser: IUser = {
        firstName: '',
        lastName: '',
        userName: '',
        telNo: ''
    };
    isLogin = false;

    public adminList = ['admin', 'krittiya22'];
    public superAdminList = ['krittiya22'];
    loginUser(userName: string, password: string) {
        console.log('serverURL', this.serverUrl);
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

    updateCurrentUser(firstName: string, lastName: string, telNo: string) {
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;
        this.currentUser.telNo = telNo;
        this.http.post<any>(this.serverUrl + '/update-user', this.currentUser).subscribe(user => {
            console.log('update user completed!');
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
            if(user.status === 'False') {
                alert('กรุณาระบุรหัสผ่านเดิมให้ถูกต้อง');
            }
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
