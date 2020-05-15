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
    numberOfLotto;
    resultList: any;
    public loggedinUser = this.authService.currentUser.userName;
    public currentUser = { currentUser: this.loggedinUser, status: 'True'};
    offset = 0;
    pageSize = 10;

    displayedColumns = ['bookNumber', 'countNumber', 'groupNumber'];
    dataSource;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    ngOnInit() {
        this.countSelectedLottoUser(this.loggedinUser);
    }

    pageChanged(event) {
        this.offset = event.pageSize * event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadUserLotto(this.offset, this.pageSize);
    }

    async countSelectedLottoUser(selectedUser) {
        await this.http.post<any>(this.serverUrl + '/get-user-selected-count', {selectedUser}).subscribe(result => {
            this.numberOfLotto = result.data;
        });
        await this.loadUserLotto(this.offset, this.pageSize);
    }

    zeroPad(num, length) {
        return num.toString().padStart(length, '0');
    }

    loadUserLotto(offsetUser, pageSizeUser) {
        const selectedUser = this.loggedinUser;
        this.http.post<any>(this.serverUrl + '/get-user-selected-lotto-paginate',
        {offsetUser, pageSizeUser, selectedUser}).subscribe(result => {
            this.resultList = result.data;
            for (const lotto of this.resultList) {
                if (lotto.bookNumber.length !== 4) {
                    lotto.bookNumber = this.zeroPad(lotto.bookNumber, 4);
                }
                if (lotto.countNumber.length !== 2) {
                    lotto.countNumber = this.zeroPad(lotto.countNumber, 2);
                }
                if (lotto.groupNumber.length !== 2) {
                    lotto.groupNumber = this.zeroPad(lotto.groupNumber, 2);
                }
            }
            this.dataSource = new MatTableDataSource<any>(this.resultList);
        });
    }
}
