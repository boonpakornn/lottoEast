import { Component, OnInit} from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from './auth.service'

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent{
    username
    password
    mouseoverLogin
    
    constructor(private authService: AuthService,
                private router: Router){
    }

    login(formValues) {
        this.authService.loginUser(formValues.userName, formValues.password)
        this.router.navigate(['report']);
    }

    cancel() {
        this.router.navigate(['report']);
    }

}