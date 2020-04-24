import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../service/auth.service';

import {MatPaginator, MatTableDataSource} from '@angular/material';
import { environment } from '../../environments/environment';

@Component({
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
    private serverUrl = environment.serverUrl;

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }
    numberOfLotto: number;
    resultList: any;
    public loggedinUser = this.authService.currentUser.userName;
    public currentUser = { currentUser: this.loggedinUser, status: 'True'};

    displayedColumns = ['bookNumber', 'countNumber', 'groupNumber'];
    dataSource;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    ngOnInit() {
        this.loadResultList();
    }

    loadResultList() {
        this.http.post<any>(this.serverUrl + '/get-result-lotto', this.currentUser).subscribe(result => {
            this.resultList = result.data;
            this.numberOfLotto = this.resultList.length;
            this.dataSource = new MatTableDataSource<any>(this.resultList);
            this.dataSource.paginator = this.paginator;
        });
    }
}
