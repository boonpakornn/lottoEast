import { Component, OnInit } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile/profile.service';

@Component({
  templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private serverUrl = environment.serverUrl;
  userData = [];
  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router,
              private profileService: ProfileService) {
  }

       ngOnInit() {
        this.getUserData();
       }

       getUserData() {
        this.http.get<any>(this.serverUrl + '/get-all-user').subscribe(result => {
            this.userData = result.data;
        });
       }

       editUserData(editUser) {
        this.profileService.isCurrentUser = false;
        this.profileService.updateEditUser(editUser);
        this.router.navigate(['user/profile']);
       }
}
