import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    userName;
    password;
    mouseoverLogin;
    constructor(private authService: AuthService,
                private router: Router) {
    }


    login(formValues) {
        this.authService.loginUser(formValues.userName, formValues.password);
        setTimeout(() => {
            if (this.authService.isLogin === true) {
                this.router.navigate(['report']);
            }
        },
        700);
    }

    showPassword() {
        const passwordField = document.getElementById('password');
        if (passwordField[0].tagName === 'password') {
            passwordField[0].tagName = 'text';
        } else {
            passwordField[0].tagName = 'password';
        }
      }

    cancel() {
        this.router.navigate(['report']);
    }

}
