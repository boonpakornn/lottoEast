
import { Injectable } from '@angular/core';
import { IUser } from './user.model'
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
    constructor( private http:HttpClient){

    }
    currentUser: IUser = {
        id: 0,
        firstName: '',
        lastName: '',
        userName: ''
    };
    isLogin = false;
    loginUser(userName: string, password: string){
        this.http.post<any>('http://localhost:3000/get-user', {userName, password}).subscribe(user => {
        if(user.data.length == 0){
            alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
        else{
            this.isLogin = true;
            this.currentUser = {
                id:1,
                firstName: user.data[0].firstName,
                lastName: user.data[0].lastName,
                userName: userName
                }    
            }
    })
    }

    updateCurrentUser(firstName: string, lastName: string){
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;
        this.http.post<any>('http://localhost:3000/update-user', this.currentUser).subscribe(user => {
            console.log('update user completed!');
        });
    }

    isAuthenticated() {
        return this.currentUser.userName !== '' ? true : false;
    }

    isAdmin() {
        if(this.currentUser.userName === 'admin') {
            return true;
        }
        else{
            return false;
        }
    }

    logout(){
        this.currentUser = {
            id: 0,
            firstName: '',
            lastName: '',
            userName: ''
        }
    }
}
