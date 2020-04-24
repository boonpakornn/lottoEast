import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  newUserForm: FormGroup;
  private serverUrl = environment.serverUrl;
  private userName: FormControl;
  private password: FormControl;
  private firstName: FormControl;
  private lastName: FormControl;
  private telNo: FormControl;
  private remark: FormControl;

  constructor(private http: HttpClient,
              private router: Router) {
  }

       ngOnInit() {
         this.userName = new FormControl('', Validators.required);
         this.password = new FormControl('', Validators.required);
         this.firstName = new FormControl('', Validators.required);
         this.lastName = new FormControl('', Validators.required);
         this.telNo = new FormControl('', Validators.required);
         this.remark = new FormControl('');
         this.newUserForm = new FormGroup({
           userName: this.userName,
           password: this.password,
           firstName: this.firstName,
           lastName: this.lastName,
           telNo: this.telNo,
           remark: this.remark
         });
       }

       addProfile(formValues) {
         if (this.newUserForm.valid) {
            this.http.post<any>(this.serverUrl + '/find-duplicate-user', formValues).subscribe(result => {
              console.log('result', result.data)
              if (result.data.length > 0) {
                alert('มีชื่อบัญชีผู้ใช้นี้นี้อยู่ในระบบแล้ว กรุณาเพิ่มชื่อผู้ใช้อื่น');
            } else {
                this.addUser(formValues);
            }
        });
            this.router.navigate(['report']);
         }
       }

       addUser(formValues) {
          console.log('addyser');
          this.http.post<any>(this.serverUrl + '/add-user', formValues).subscribe(result => {
          console.log('result', result);
          });
       }

        validateUserName() {
            return this.userName.valid || this.userName.untouched;
        }

        validatePassword() {
            return this.password.valid || this.password.untouched;
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
}
