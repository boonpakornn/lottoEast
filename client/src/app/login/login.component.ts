import { Component, OnInit} from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../user/auth.service'
import { TestBed } from '@angular/core/testing'

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
        this.authService.loginUser(formValues.userName, formValues.password);
        setTimeout(() => 
        {
            console.log('flag', this.authService.isLogin);
            if(this.authService.isLogin === true){
                this.router.navigate(['report']);
            }
        },
        500);
        
    }


    cancel() {
        this.router.navigate(['report']);
    }

}