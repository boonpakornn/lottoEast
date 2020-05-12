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
    lottoPaginateData: any;
    lottoUserData: any;

    bookData: any;
    numberOfLotto = 0;
    numberOfSelectedLottoUser: number;

    userList: any = [];
    selectedUser: string;

    isDisable = true;

    timer: any;
    loadingTime: number;
    timeFactor = 20;

    pageSize = 10;
    offset = 0;

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
            console.log('bookData :', this.bookData);
            this.loadingTime = this.bookData.length * this.timeFactor < 2000 ? 2000 : this.bookData.length * this.timeFactor;
            console.log('loadingTime :', this.loadingTime);
        });
    }

    countLotto() {
        this.http.get<any>(this.serverUrl + '/get-count').subscribe(result => {
            this.numberOfLotto = result.data;
        });
    }

    async loadLottoData(offset, pageSize) {
        await this.http.post<any>(this.serverUrl + '/get-all-lotto-paginate', {offset, pageSize}).subscribe(result => {
            this.lottoPaginateData = result.data;
            this.dataSourceAll = new MatTableDataSource<any>(this.lottoPaginateData);
        });
        await this.countSelectedLottoUser(this.selectedUser);
    }

    loadAllUser() {
        this.http.get<any>(this.serverUrl + '/get-all-user').subscribe(result => {
            this.userList = result.data;
        });
    }

    async autoSelection() {
        await this.spinner.show();
        if (this.numberModel.num === 0) {
            alert('กรุณาเลือกจำนวนสลากขั้นต่ำ');
        } else if (this.countNum < 1 || this.countNum > 99 ) {
            alert('กรุณาใส่หมายเลขงวดให้ถูกต้อง (1-99)');
        } else {
        await _(this.bookData).forEach((bookNum, index) => {
            const bookArray = this.lottoListData.filter((el) => {
                return el.bookNumber === bookNum;
              });
            this.processBookArray(bookArray, bookNum);
        });
        }
        await setTimeout(() => {
            this.loadLottoData(this.offset, this.pageSize);
        }, this.loadingTime);
    }

    async processBookArray(bookArray, bookNum) {
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
                        }
                    }
            }
        });
        this.updateSetLotto(bookNumber, countNumber, selectedSet);
    }

    async updateClickedLotto(data) {
        await this.updateLotto(data);
        await setTimeout(() => {
            this.loadLottoData(this.offset, this.pageSize);
        }, 100);
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
        await setTimeout(() => {
            this.loadLottoData(this.offset, this.pageSize);
        }, 5000);
    }
    openConfirmationDialog() {
        const dialog = confirm('ยืนยันเพื่อลบข้อมูลสลากทั้งหมด');
        if (dialog === true) {
            this.deleteAllLotto();
        }
    }

    async deleteAll() {
        await this.lottoService.deleteAllLotto();
        await this.loadBookNumber();
    }

    async deleteAllLotto() {
        await this.deleteAll();
        await this.loadLottoData(this.offset, this.pageSize);
    }

    async loadUserLotto() {
        if (this.selectedUser !== undefined) {
            const selectedUser = this.selectedUser;
            await this.http.post<any>(this.serverUrl + '/get-user-selected-lotto', {selectedUser}).subscribe(result => {
                this.lottoUserData = result.data;
                this.dataSourceUser = new MatTableDataSource<any>(this.lottoUserData);
                this.dataSourceUser.paginator = this.paginatorUser;
            });
        }
        await this.spinner.hide();
    }

    async countSelectedLottoUser(selectedUser) {
        await this.http.post<any>(this.serverUrl + '/get-user-selected-count', {selectedUser}).subscribe(result => {
            this.numberOfSelectedLottoUser = result.data;
            this.isDisable = this.numberOfSelectedLottoUser > 0 ? false : true;
        });
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
