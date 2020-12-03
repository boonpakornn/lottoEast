import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import { TimeService } from '../service/time-service';
import { LottoService } from '../service/lotto.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from '../../environments/environment';
import _ from 'lodash';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

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

    isDisable = true;

    setNumber: {};
    numberModel = { num: 0, name: '', label: ''};

    lottoListData: any;
    lottoPaginateData: any;
    lottoUserData: any;

    bookData: any;
    numberOfLotto = 0;
    numberOfSelectedLottoUser: number;

    userList: any = [];
    selectedUser: string;

    timer: any;
    loadingTime: number;
    timeFactor = 1000;
    partition = 50;
    delayTime = 0;

    pageSize = 10;
    offset = 0;
    queuedArray = [];

    pageSizeUser = 10;
    offsetUser = 0;

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
        this.spinner.show();
        this.countLotto();
        this.loadAllLotto();
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

        this.loadLottoData(this.offset, this.pageSize);
        this.loadAllUser();
        this.loadBookNumber();
        this.onValueChanges();
    }

    onValueChanges(): void {
        this.countForm.valueChanges.subscribe(data => {
          this.countNum = data.countSpec;
        });
    }

    pageChanged(event) {
        this.offset = event.pageSize * event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadLottoData(this.offset, this.pageSize);
    }

    userPageChanged(event) {
        this.offsetUser = event.pageSize * event.pageIndex;
        this.pageSizeUser = event.pageSize;
        this.loadUserLotto();
    }

    loadAllLotto() {
        this.http.get<any>(this.serverUrl + '/get-all-lotto').subscribe(result => {
            this.lottoListData = result.data;
        });
    }

    async loadBookNumber() {
        await this.http.get<any>(this.serverUrl + '/get-all-book-number').subscribe(result => {
            this.bookData = result.data;
            this.loadingTime = this.bookData.length < this.partition ?
             this.timeFactor * 2 : ((Math.floor(this.bookData.length / this.partition) + 1) * this.timeFactor);
        });
    }

    countLotto() {
        this.http.get<any>(this.serverUrl + '/get-count').subscribe(result => {
            this.numberOfLotto = result.data;
        });
    }

    zeroPad(num, length) {
        return num.toString().padStart(length, '0');
    }

    async loadLottoData(offset, pageSize) {
        await this.http.post<any>(this.serverUrl + '/get-all-lotto-paginate', {offset, pageSize}).subscribe(result => {
            this.lottoPaginateData = result.data;
            for (const lotto of this.lottoPaginateData) {
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
            this.dataSourceAll = new MatTableDataSource<any>(this.lottoPaginateData);
        });
        await this.selectedLottoUser(this.selectedUser);
    }

    loadAllUser() {
        this.http.get<any>(this.serverUrl + '/get-all-user').subscribe(result => {
            this.userList = result.data;
            this.userList.splice(0, 0, {userName: 'ทั้งหมด'});
        });
    }

    async export() {
        let exportData;
        await this.http.get<any>(this.serverUrl + '/get-all-lotto').subscribe(result => {
            exportData = result.data;

            if (exportData.length) {
                const workbook = new Workbook();
                const worksheet = workbook.addWorksheet('เลขทั้งหมด');
                const header = ['งวดที่', 'ชื่อคนส่ง', 'ชุดที่', 'เลขที่'];
                worksheet.addRow(header);

                for (const item of exportData) {
                    worksheet.addRow([
                        item.countNumber.toString().padStart(2, '0'),
                        item.sender,
                        item.groupNumber.toString().padStart(2, '0'),
                        item.bookNumber.toString().padStart(4, '0')
                    ]);
                }

                const fname = 'เลขทั้งหมด';

                workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, fname + '-' + new Date().toISOString() + '.xlsx');
                });
            }
        });
    }

    async autoSelection() {
        this.queuedArray = [];
        await this.spinner.show();
        if (this.numberModel.num === 0) {
            alert('กรุณาเลือกจำนวนสลากขั้นต่ำ');
            this.spinner.hide();
        } else if (this.countNum < 1 || this.countNum > 99 ) {
            alert('กรุณาใส่หมายเลขงวดให้ถูกต้อง (1-99)');
            this.spinner.hide();
        } else {
        for (const [index, bookNum] of this.bookData.entries()) {
            const bookArray = this.lottoListData.filter((el) => {
                return el.bookNumber === bookNum;
            });
            let flag = false;
            if (index === this.bookData.length - 1 || (index % 50 === 0 && index !== 0)) {
                flag = true;
            }
            this.processBookArray(bookArray, bookNum, flag);
        }
        await setTimeout(() => {
            this.loadLottoData(this.offset, this.pageSize);
        }, this.loadingTime);
        }
    }

    async processBookArray(bookArray, bookNum, flag) {
        const bookNumber = bookNum;
        const countNumber = this.countNum;
        // current
        let cSet = 0;
        let cCount = 0;
        // next
        let nSet = 0;
        let nCount = 0;

        let count = 0;
        let previous = false;
        const selectedSet = [];
        await _(bookArray).forEach((element, index) => {
            if (index !== bookArray.length - 1) {
                cSet = element.group;
                cCount = element.countNumber;
                nSet = bookArray[index + 1].group;
                nCount = bookArray[index + 1].countNumber;
                if (cSet === nSet && cCount === countNumber && nCount === countNumber) {
                    previous = true;
                    count++;
                    if (index === bookArray.length - 2) {
                        count++;
                        if (count >= this.numberModel.num) {
                            selectedSet.push(cSet);
                            count = 0;
                        }
                    }
                } else {
                    if (previous === true) {
                        previous = false;
                        count++;
                    }
                    if (count >= this.numberModel.num) {
                        selectedSet.push(cSet);
                        count = 0;
                        } else {
                            count = 0;
                        }
                    }
            }
        });
        if (selectedSet.length !== 0) {
            this.queuedArray.push({bookNumber, selectedSet});
        }
        if (flag === true) {
            this.updateSetLotto(this.queuedArray, this.countNum);
            this.queuedArray = [];
        }
    }

    async updateClickedLotto(data) {
        await this.updateLotto(data);
        await setTimeout(() => {
            this.loadLottoData(this.offset, this.pageSize);
        }, 100);
    }

    async updateSetLotto(queuedArray, countNumber) {
        await this.lottoService.updateSetLotto(queuedArray, countNumber);
    }

    updateLotto(lotto) {
        this.lottoService.updateLotto(lotto);
    }

    async updateLottoToFalse() {
        await this.spinner.show();
        await this.lottoService.updateAllLottoToFalse();
        await setTimeout(() => {
            this.loadLottoData(this.offset, this.pageSize);
        }, 2000);
    }
    openConfirmationDialog() {
        const dialog = confirm('ยืนยันเพื่อลบข้อมูลสลากทั้งหมด');
        if (dialog === true) {
            this.spinner.show();
            this.deleteAllLotto();
        }
    }

    async deleteAllLotto() {
        await this.lottoService.deleteAllLotto();
        await this.loadBookNumber();
        await setTimeout(() => {
            this.loadLottoData(this.offset, this.pageSize);
            this.countLotto();
        }, 2000);
    }

    async loadUserLotto() {
        if (this.selectedUser !== undefined) {
            const selectedUser = this.selectedUser === 'ทั้งหมด' ? undefined : this.selectedUser;
            await this.http.post<any>(this.serverUrl + '/get-user-selected-lotto', {selectedUser}).subscribe(result => {
                this.lottoUserData = result.data;
                for (const lotto of this.lottoUserData) {
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
                this.dataSourceUser = new MatTableDataSource<any>(this.lottoUserData);
                this.dataSourceUser.paginator = this.paginatorUser;
            });
        }
        await this.spinner.hide();
    }

    async selectedLottoUser(selectedUser) {
        this.selectedUser = selectedUser;
        if (this.selectedUser !== undefined) {
            this.isDisable = false;
        }
        await this.loadUserLotto();
    }

    saveTime(values) {
        if (this.isNumeric(values.startHour) &&
            this.isNumeric(values.startMinute) &&
            this.isNumeric(values.endHour) &&
            this.isNumeric(values.endMinute)) {
            this.http.post<any>(this.serverUrl + '/update-time', values).subscribe(result => {
                this.timeService.getTime();
            });

        } else {
            alert('กรุณากรอกข้อมูลให้ครบและเป็นตัวเลขเวลาเท่านั้น');
        }
    }

    saveCount(values) {
        if (this.isNumeric(values.countSpec)) {
            this.countNum = values.countSpec;
        } else {
            alert('กรุณากรอกข้อมูลและเป็นตัวเลขงวดเท่านั้น (1-99)');
        }
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

}
