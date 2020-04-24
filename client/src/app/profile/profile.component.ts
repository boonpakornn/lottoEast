import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../service/profile.service';

@Component({
  templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  private userName: FormControl;
  private firstName: FormControl;
  private lastName: FormControl;
  private telNo: FormControl;
  private isCurrentUser;

  constructor(public authService: AuthService,
              public router: Router,
              public profileService: ProfileService) {
  }

       ngOnInit() {
         this.isCurrentUser = this.profileService.isCurrentUser;
         console.log('flag', this.profileService.isCurrentUser);

         this.userName = new FormControl({value: this.isCurrentUser ?
           this.authService.currentUser.userName : this.profileService.editUser.userName, disabled: true}, Validators.required);
         this.firstName = new FormControl(this.isCurrentUser ?
          this.authService.currentUser.firstName : this.profileService.editUser.firstName, Validators.required);
         this.lastName = new FormControl(this.isCurrentUser ?
          this.authService.currentUser.lastName : this.profileService.editUser.lastName, Validators.required);
         this.telNo = new FormControl(this.isCurrentUser ?
          this.authService.currentUser.telNo : this.profileService.editUser.telNo, Validators.required);
         this.profileForm = new FormGroup({
           userName: this.userName,
           firstName: this.firstName,
           lastName: this.lastName,
           telNo: this.telNo
         });
       }

       saveProfile(formValues) {
         const userName = this.isCurrentUser ?
         this.authService.currentUser.userName : this.profileService.editUser.userName;
         console.log('username',userName);
         if (this.profileForm.valid) {
          this.authService.updateCurrentUser(userName, formValues.firstName, formValues.lastName, formValues.telNo);
          alert('แก้ไขข้อมูลผู้ใช้สำเร็จ');
          this.router.navigate(['report']);
         }
       }

       validateFirstName() {
       return this.firstName.valid || this.firstName.untouched;
       }

       validateLastName() {
       return this.lastName.valid || this.lastName.untouched;
       }

       validateTelNo() {
        return this.telNo.valid || this.telNo.untouched;
      }

       cancel() {
         this.router.navigate(['report']);
       }

       changePassword() {
        this.router.navigate(['user/changepassword']);
      }
}
