import { Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { environment } from '../../environments/environment';
import _ from 'lodash';

import { AuthService } from '../service/auth.service';
import { TimeService } from '../service/time-service';
import { LottoService } from '../service/lotto.service';

@Component({
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit{
    // lottoForm: FormGroup;
    @Input() lottoForm: FormGroup;
    private lottoNum: FormControl;
    private serverUrl = environment.serverUrl;
    constructor(private http: HttpClient,
                private authService: AuthService,
                private timeService: TimeService,
                private lottoService: LottoService) {
    }
    public loggedinUser = this.authService.currentUser.userName;
    public lottoData: any[] = [];
    public isValid = true;
    public numberOfLotto = 0;
    public currentUser = { currentUser: this.loggedinUser};
    public isAvailable = true;
    offset = 0;
    pageSize = 10;

    displayedColumns = ['bookNumber', 'countNumber', 'groupNumber', 'delete'];
    dataSource;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    ngOnInit() {
        this.countUserLotto(this.loggedinUser);
        this.timeService.getTime();
        this.lottoNum = new FormControl('', Validators.required);
        this.lottoForm = new FormGroup({
            lottoNum: this.lottoNum
          });
        this.loadLottoPaginateData(this.offset, this.pageSize, this.loggedinUser);
        this.onValueChanges();
        setTimeout(() => {
            this.isAvailable = this.timeService.compareTime();
        },
        300);
    }

    onValueChanges(): void {
        this.lottoForm.valueChanges.subscribe(data => {
          if (data.lottoNum.length === 16) {
            this.findDuplicatedLotto(data);
          }
        });
    }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    findDuplicatedLotto(data) {
        data.currentUser = this.loggedinUser;
        if (this.isNumeric(data.lottoNum) && (data.lottoNum.length === 8 || data.lottoNum.length === 16)) {
            if (this.timeService.compareTime()) {
            this.isValid = true;
            // this.http.post<any>(this.serverUrl + '/find-duplicate-lotto', data).subscribe(result => {
            //     // if (result.data.length > 0) {
            //     //     alert('มีข้อมูลสลากหมายเลขนี้อยู่ในระบบแล้ว กรุณาเพิ่มสลากหมายเลขอื่น');
            //     // } else {
            //     //     this.submitLottoData(data);
            //     // }
            // });
            this.submitLottoData(data);
            } else {
                alert('ขออภัย ขณะนี้อยู่นอกเวลาเปิดรับสลาก กรุณาติดต่อผู้ดูแลระบบ');
            }
        } else {
            this.isValid = false;
        }
        this.lottoForm.reset({
            lottoNum: ''
          });
    }

    pageChanged(event) {
        this.offset = event.pageSize * event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadLottoPaginateData(this.offset, this.pageSize, this.loggedinUser);
    }

    async submitLottoData(data) {
            await this.lottoService.addLotto(data);
            await setTimeout(() => {this.countUserLotto(this.loggedinUser); }, 200);
    }

    async countUserLotto(loggedinUser) {
        await this.http.post<any>(this.serverUrl + '/get-user-count', {loggedinUser}).subscribe(result => {
            this.numberOfLotto = result.data;
        });
        await this.loadLottoPaginateData(this.offset, this.pageSize, this.loggedinUser);
    }

    openConfirmationDialog(data) {
        const dialog = confirm('ยืนยันเพื่อลบข้อมูลสลากชุดนี้จากระบบ');
        if (dialog === true) {
            this.deleteLotto(data);
        }
    }

    async deleteLotto(data) {
        await this.lottoService.deleteLotto(data);
        await setTimeout(() => { this.countUserLotto(this.loggedinUser); }, 200);
        await await this.loadLottoPaginateData(this.offset, this.pageSize, this.loggedinUser);
    }

    zeroPad(num, length) {
        return num.toString().padStart(length, '0');
    }

    loadLottoPaginateData(offset, pageSize, loggedinUser) {
        this.http.post<any>(this.serverUrl + '/get-user-lotto-paginate', {offset, pageSize, loggedinUser}).subscribe(result => {
            this.lottoData = result.data;
            for (const lotto of this.lottoData) {
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
            this.dataSource = new MatTableDataSource<any>(this.lottoData);
        });
    }
}
