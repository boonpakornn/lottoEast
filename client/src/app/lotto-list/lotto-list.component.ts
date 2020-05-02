import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import { TimeService } from '../service/time-service';
import { LottoService } from '../service/lotto.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from '../../environments/environment';
import _ from 'lodash';


@Component({
    templateUrl: './lotto-list.component.html',
    styleUrls: ['./lotto-list.component.scss']
})
export class LottoListComponent implements OnInit {
    private serverUrl = environment.serverUrl;
    timeForm: FormGroup;
    private startHour: FormControl;
    private startMinute: FormControl;
    private endHour: FormControl;
    private endMinute: FormControl;

    countForm: FormGroup;
    private countSpec: FormControl;
    countNum = 1;

    setNumber: {};
    numberModel = { num: 0, name: '', label: ''};

    lottoListData: any;
    numberOfLotto: number;
    timer: any;
    userList: any = [];
    selectedUser: string;
    lottoUserData: any;
    isDisable = true;

    displayedColumnsAll = ['bookNumber', 'countNumber', 'groupNumber', 'sender', 'status', 'selected'];
    dataSourceAll;

    displayedColumnsUser = ['bookNumber', 'countNumber', 'groupNumber'];
    dataSourceUser;

    @ViewChild('paginatorAll', { read: MatPaginator, static: false}) paginatorAll: MatPaginator;
    @ViewChild('paginatorUser', { read: MatPaginator, static: false}) paginatorUser: MatPaginator;

    constructor(private http: HttpClient,
                private timeService: TimeService,
                private lottoService: LottoService,
                private spinner: NgxSpinnerService
                ) {
    }

    ngOnInit() {
        this.setNumber = [
            { num: 2, name: '2 ชุด', label: 'ขั้นต่ำ 2 ชุด' },
            { num: 3, name: '3 ชุด', label: 'ขั้นต่ำ 3 ชุด'},
            { num: 4, name: '4 ชุด', label: 'ขั้นต่ำ 4 ชุด'},
        ];
        this.timeService.getTime();
        this.startHour = new FormControl(this.timeService.startHour, Validators.required);
        this.startMinute = new FormControl(this.timeService.startMinute, Validators.required);
        this.endHour = new FormControl(this.timeService.endHour, Validators.required);
        this.endMinute = new FormControl(this.timeService.endMinute, Validators.required);
        this.timeForm = new FormGroup({
          startHour: this.startHour,
          startMinute: this.startMinute,
          endHour: this.endHour,
          endMinute: this.endMinute
        });

        this.countSpec = new FormControl(1, Validators.required);
        this.countForm = new FormGroup({
            countSpec: this.countSpec
        });

        this.loadLottoListData();
        this.loadAllUser();
        this.onValueChanges();
    }

    onValueChanges(): void {
        this.countForm.valueChanges.subscribe(data => {
          this.countNum = data.countSpec;
        });
    }

    async loadLottoListData() {
        await this.http.post<any>(this.serverUrl + '/get-all-lotto', {}).subscribe(result => {
            this.lottoListData = result.data;
            this.numberOfLotto = this.lottoListData.length;
            this.dataSourceAll = new MatTableDataSource<any>(this.lottoListData);
            this.dataSourceAll.paginator = this.paginatorAll;
        });
        await this.updateUserLotto();
    }

    loadAllUser() {
        this.http.get<any>(this.serverUrl + '/get-all-user').subscribe(result => {
            this.userList = result.data;
            console.log('userList', this.userList);
        });
    }

    async autoSelection() {
        await this.spinner.show();
        // current
        let cNum = 0;
        let cSet = 0;
        let cCount = 0;
        // next
        let nNum = 0;
        let nSet = 0;
        let nCount = 0;

        let count = 0;
        let previous = false;
        let check = [];
        if (this.numberModel.num === 0) {
            alert('กรุณาเลือกจำนวนสลากขั้นต่ำ');
        }
        else if (this.countNum < 1 || this.countNum > 99 ) {
            alert('กรุณาใส่หมายเลขงวดให้ถูกต้อง (1-99)');
        }
        else {
            await _(this.lottoListData).forEach((element, index) => {
                if (index !== this.lottoListData.length - 1) {
                    cNum = element.bookNumber;
                    cSet = Math.ceil(element.groupNumber / 5);
                    cCount = element.countNumber;
                    nNum = this.lottoListData[index + 1].bookNumber;
                    nSet = Math.ceil(this.lottoListData[index + 1].groupNumber / 5);
                    nCount = this.lottoListData[index + 1].countNumber;
                    if (cNum === nNum && cSet === nSet && cCount === this.countNum && nCount === this.countNum) {
                        previous = true;
                        count++;
                        check.push(index);
                        if (index === this.lottoListData.length - 2) {
                            count++;
                            check.push(index + 1);
                            if (count >= this.numberModel.num) {
                                const bookNumber = this.lottoListData[check[0]].bookNumber;
                                const countNumber = this.countNum;
                                const groupNumber = this.lottoListData[check[0]].group;
                                this.updateSetLotto(bookNumber, countNumber, groupNumber);
                            }
                        }
                    }
                    else {
                        if (previous === true) {
                            previous = false;
                            count++;
                            check.push(index);
                        }
                        if (count >= this.numberModel.num) {
                            const bookNumber = this.lottoListData[check[0]].bookNumber;
                            const countNumber = this.countNum;
                            const groupNumber = this.lottoListData[check[0]].group;
                            this.updateSetLotto(bookNumber, countNumber, groupNumber);
                        }
                        check = [];
                        count = 0;
                    }
                }
            });
            this.loadLottoListData();
        }
    }

    async updateClickedLotto(data) {
        await this.updateLotto(data);
        await this.loadLottoListData();
    }

    updateSetLotto(bookNumber, countNumber, groupNumber) {
        this.lottoService.updateSetLotto(bookNumber, countNumber, groupNumber);
    }

    updateLotto(lotto) {
        this.lottoService.updateLotto(lotto);
    }

    async updateLottoToFalse() {
        await this.spinner.show();
        await this.lottoService.updateAllLottoToFalse();
        setTimeout(d => {}, 500);
        await this.loadLottoListData();
    }
    openConfirmationDialog() {
        const dialog = confirm('ยืนยันเพื่อลบข้อมูลสลากทั้งหมด');
        if (dialog === true) {
            this.deleteAllLotto();
        }
    }

    async deleteAll() {
        await this.lottoService.deleteAllLotto();
    }

    async deleteAllLotto() {
        await this.deleteAll();
        await this.loadLottoListData();
    }

    async updateUserLotto() {
        if (this.selectedUser !== undefined) {
            await this.http.post<any>(this.serverUrl + '/get-user-lotto',
            {userName: this.selectedUser}).subscribe(result => {
                this.lottoUserData = result.data;
                this.dataSourceUser = new MatTableDataSource<any>(this.lottoUserData);
                this.dataSourceUser.paginator = this.paginatorUser;
                this.isDisable = this.lottoUserData.length > 0 ? false : true;
            });
        }
        await this.spinner.hide();
    }

    validateStartHour() {
        return this.startHour.valid || this.startHour.untouched;
    }

    validateStartMinute() {
        return this.startMinute.valid || this.startMinute.untouched;
    }

    validateEndHour() {
        return this.endHour.valid || this.endHour.untouched;
    }

    validateEndMinute() {
        return this.endMinute.valid || this.endMinute.untouched;
    }

    validateCount() {
        return this.countSpec.valid || this.countSpec.untouched;
    }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    saveTime(values) {
        if (this.isNumeric(values.startHour) &&
            this.isNumeric(values.startMinute) &&
            this.isNumeric(values.endHour) &&
            this.isNumeric(values.endMinute)) {
            this.http.post<any>(this.serverUrl + '/update-time', values).subscribe(result => {
                console.log('result', result);
                this.timeService.getTime();
            });

        }
        else {
            alert('กรุณากรอกข้อมูลให้ครบและเป็นตัวเลขเวลาเท่านั้น');
        }
    }

    saveCount(values) {
        if (this.isNumeric(values.countSpec)){
            this.countNum = values.countSpec;
        }
        else {
            alert('กรุณากรอกข้อมูลและเป็นตัวเลขงวดเท่านั้น (1-99)');
        }
    }
}
