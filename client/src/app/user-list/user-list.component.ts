import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../service/profile.service';
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
  offset = 0;
  pageSize = 10;
  numberOfUser = 0;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router,
              private profileService: ProfileService) {
  }

       ngOnInit() {
        this.countUser();
       }

       async countUser() {
        await this.http.get<any>(this.serverUrl + '/get-user-count').subscribe(result => {
            this.numberOfUser = result.data;
        });
        await this.getUserData(this.offset, this.pageSize);
    }

       pageChanged(event) {
        this.offset = event.pageSize * event.pageIndex;
        this.pageSize = event.pageSize;
        this.getUserData(this.offset, this.pageSize);
    }

       getUserData(offset, pageSize) {
        this.http.post<any>(this.serverUrl + '/get-all-user-paginate', {offset, pageSize}).subscribe(result => {
            this.userData = result.data;
            this.dataSource = new MatTableDataSource<any>(this.userData);
        });
       }

       editUserData(editUser) {
        this.profileService.isCurrentUser = false;
        this.profileService.updateEditUser(editUser);
        this.router.navigate(['user/profile']);
       }
}
