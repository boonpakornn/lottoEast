import { Component, OnInit} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service'

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent{
    constructor(private authService: AuthService){
    }

    login(formValues) {
        this.authService.loginUser(formValues.userName, formValues.password)
    }

}