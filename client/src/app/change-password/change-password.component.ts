import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';

@Component({
  templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  private oldPassword: FormControl;
  private newPassword: FormControl;
  private repeatedPassword: FormControl;

  constructor(private authService: AuthService,
              private router: Router,
              private profileService: ProfileService) {
  }

       ngOnInit() {
        this.oldPassword = new FormControl('', Validators.required);
        this.newPassword = new FormControl('', Validators.required);
        this.repeatedPassword = new FormControl('', Validators.required);
        this.passwordForm = new FormGroup({
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
            repeatedPassword: this.repeatedPassword,
        });
       }

       validateOldPassword() {
        return this.oldPassword.valid || this.oldPassword.untouched;
        }

       validateNewPassword() {
            return this.newPassword.valid || this.newPassword.untouched;
        }

       validateRepeatedPassword() {
            return this.repeatedPassword.valid || this.repeatedPassword.untouched;
        }

       changePassword(value) {
           const userName = this.profileService.isCurrentUser ?
           this.authService.currentUser.userName : this.profileService.editUser.userName;
           Object.assign(value, {userName});
           if (value.newPassword === value.repeatedPassword) {
                this.authService.changePassword(value.oldPassword, value.newPassword, value.userName);
           }
           else {
               alert('กรุณากรอกรหัสผ่านใหม่ให้ถูกต้อง');
           }
           this.router.navigate(['user/profile']);
       }

       cancel() {
            this.router.navigate(['user/profile']);
       }
}
