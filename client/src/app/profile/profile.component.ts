import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService,
              private router: Router) {
  }

       ngOnInit() {
         this.userName = new FormControl({value: this.authService.currentUser.userName, disabled: true}, Validators.required);
         this.firstName = new FormControl(this.authService.currentUser.firstName, Validators.required);
         this.lastName = new FormControl(this.authService.currentUser.lastName, Validators.required);
         this.telNo = new FormControl(this.authService.currentUser.telNo, Validators.required);
         this.profileForm = new FormGroup({
           userName: this.userName,
           firstName: this.firstName,
           lastName: this.lastName,
           telNo: this.telNo
         });
       }

       saveProfile(formValues) {
         if (this.profileForm.valid) {
          this.authService.updateCurrentUser(formValues.firstName, formValues.lastName, formValues.telNo);
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
