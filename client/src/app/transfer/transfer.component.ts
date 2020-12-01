import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../service/auth.service';

import {MatPaginator, MatTableDataSource} from '@angular/material';
import { environment } from '../../environments/environment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

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
    exist = true;

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
            this.exist = this.numberOfLotto ? false : true;
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

    export() {
        let exportData;
        const selectedUser = this.loggedinUser;
        this.http.post<any>(this.serverUrl + '/get-user-unselected-lotto',
        {selectedUser}).subscribe(result => {
            exportData = result.data;

            if (exportData.length) {
                const workbook = new Workbook();
                const worksheet = workbook.addWorksheet('เลขไม่ชน');
                const header = ['barcode'];
                const headerRow = worksheet.addRow(header);

                const record = [];
                for (const item of exportData) {
                    record.push(item.bookNumber.toString() + item.countNumber.toString() + item.groupNumber.toString());
                }

                worksheet.addRow(record);

                const fname = 'เลขไม่ชน';

                workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, fname + '-' + new Date().toISOString() + '.xlsx');
                });
            }
        });
    }
}
