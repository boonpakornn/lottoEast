import { Component, OnInit, ɵCodegenComponentFactoryResolver} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../dialog/dialog.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TimeService } from '../report-list/time-service';
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

    setNumber: {};
    numberModel = { num: 0, name: '' };

    lottoListData: any;
    numberOfLotto: number;
    timer: any;
    constructor(private http: HttpClient,
                private dialogService: DialogService,
                private timeService: TimeService,
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

        this.loadLottoListData();
        // this.checkInputTime();
    }

    checkInputTime() {
        //setInterval((d) => {console.log( new Date().getHours()); }, 60000);
    }

    loadLottoListData() {
        this.http.get<any>(this.serverUrl + '/get-all-lotto').subscribe(result => {
            this.lottoListData = result.data;
            this.numberOfLotto = this.lottoListData.length;
        });
    }

    autoSelection() {
        // current
        var cNum = 0;
        var cSet = 0;
        var cCount = 0;
        // next
        var nNum = 0;
        var nSet = 0;
        var nCount = 0;

        var count = 0;
        var previous = false;
        var check = [];
        var hit = [];
        if (this.numberModel.num === 0) {
            alert('กรุณาเลือกจำนวนสลากขั้นต่ำ');
        }
        else {
            hit = [];
            _(this.lottoListData).forEach((element, index) => {
                if (index !== this.lottoListData.length - 1) {
                    cNum = parseInt(element.bookNumber);
                    cSet = Math.ceil(parseInt(element.groupNumber)/ 5);
                    cCount = parseInt(element.countNumber);
                    nNum = parseInt(this.lottoListData[index + 1].bookNumber);
                    nSet = Math.ceil(parseInt(this.lottoListData[index + 1].groupNumber)/ 5);
                    nCount = parseInt(this.lottoListData[index + 1].countNumber);
                    console.log(cNum, cSet, nNum, nSet);
                    if (cNum === nNum && cSet === nSet && cCount === 1 && nCount === 1) {
                        previous = true;
                        count++;
                        check.push(index);
                    }
                    else {
                        if(previous === true) {
                            previous = false;
                            count++;
                            check.push(index);
                        }
                        console.log('count', count);
                        if(count >= 3) {
                            console.log('check', check);
                            hit = hit.concat(check);
                        }
                        check = [];
                        count = 0;
                    }
                }
            });
            console.log('hit', hit);
        }
    }

    updateLotto(data) {
        this.http.post<any>(this.serverUrl + '/update-lotto', data).subscribe(result => {
            console.log('update', result);
        });
        setTimeout(() => {
            this.loadLottoListData();
        },
        500);
    }

    openConfirmationDialog() {
        this.dialogService.confirm('ลบข้อมูลสลาก', 'ยืนยันเพื่อลบข้อมูลสลากทั้งหมด')
        .then((confirmed) => confirmed === true ? this.deleteAllLotto() : {})
        .catch(() => console.log('User dismissed the dialog'));
    }

    deleteAllLotto() {
        this.http.post<any>(this.serverUrl + '/deleteall-lotto', {}).subscribe(result => {
            console.log('deleteall', result);
        });
        setTimeout(() => {
            this.loadLottoListData();
        },
        500);
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
}
