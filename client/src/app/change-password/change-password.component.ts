import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) {
  }

       ngOnInit() {
       }
}
