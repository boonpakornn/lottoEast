import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../service/auth.service';

import {MatPaginator, MatTableDataSource} from '@angular/material';
import { environment } from '../../environments/environment';

@Component({
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
    private serverUrl = environment.serverUrl;

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }
    numberOfLotto;
    transferList: any;
    public loggedinUser = this.authService.currentUser.userName;
    public currentUser = { currentUser: this.loggedinUser, status: 'True'};
    offset = 0;
    pageSize = 10;

    displayedColumns = ['bookNumber', 'countNumber', 'groupNumber'];
    dataSource;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    ngOnInit() {
        this.countUnSelectedLottoUser(this.loggedinUser);
    }

    pageChanged(event) {
        this.offset = event.pageSize * event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadUserLotto(this.offset, this.pageSize);
    }

    async countUnSelectedLottoUser(selectedUser) {
        await this.http.post<any>(this.serverUrl + '/get-user-unselected-count', {selectedUser}).subscribe(result => {
            this.numberOfLotto = result.data;
        });
        await this.loadUserLotto(this.offset, this.pageSize);
    }

    zeroPad(num, length) {
        return num.toString().padStart(length, '0');
    }

    loadUserLotto(offsetUser, pageSizeUser) {
        const selectedUser = this.loggedinUser;
        this.http.post<any>(this.serverUrl + '/get-user-unselected-lotto-paginate',
        {offsetUser, pageSizeUser, selectedUser}).subscribe(result => {
            this.transferList = result.data;
            for (const lotto of this.transferList) {
                lotto.bookNumber = this.zeroPad(lotto.bookNumber, 4);
            }
            this.dataSource = new MatTableDataSource<any>(this.transferList);
        });
    }
}
