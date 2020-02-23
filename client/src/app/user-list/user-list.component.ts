import { Component, OnInit } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private serverUrl = environment.serverUrl;
  private userData = [];
  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router) {
  }

       ngOnInit() {
        this.getUserData();
       }

       getUserData() {
        this.http.get<any>(this.serverUrl + '/get-all-user').subscribe(result => {
            console.log('user: ', result);
            this.userData = result.data;
        });
    }
}
