import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile/profile.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import { environment } from '../../environments/environment';

@Component({
  templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private serverUrl = environment.serverUrl;
  userData = [];

  displayedColumns = ['userName', 'firstName', 'lastName', 'telNo', 'remark', 'edit'];
  dataSource;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
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
            this.dataSource = new MatTableDataSource<any>(this.userData);
            this.dataSource.paginator = this.paginator;
        });
       }

       editUserData(editUser) {
        this.profileService.isCurrentUser = false;
        this.profileService.updateEditUser(editUser);
        this.router.navigate(['user/profile']);
       }
}
