import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../dialog/dialog.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TimeService } from '../report-list/time-service';

@Component({
    templateUrl: './lotto-list.component.html',
    styleUrls: ['./lotto-list.component.scss']
})
export class LottoListComponent implements OnInit {
    timeForm: FormGroup;
    private startHour: FormControl;
    private startMinute: FormControl;
    private endHour: FormControl;
    private endMinute: FormControl;

    lottoListData: any;
    timer: any;
    constructor(private http: HttpClient,
                private dialogService: DialogService,
                private timeService: TimeService) {
    }

    ngOnInit() {
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
        setInterval((d) => {console.log( new Date().getHours())} , 1000);
    }

    loadLottoListData() {
        this.http.get<any>('http://localhost:3000/get-all-lotto').subscribe(result => {
            this.lottoListData = result.data;
        });
    }

    updateLotto(data) {
        this.http.post<any>('http://localhost:3000/update-lotto', data).subscribe(result => {
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
        this.http.post<any>('http://localhost:3000/deleteall-lotto', {}).subscribe(result => {
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
            this.http.post<any>('http://localhost:3000/update-time', values).subscribe(result => {
                console.log('result', result);
                this.timeService.getTime();
            });

        }
        else {
            alert('กรุณากรอกข้อมูลให้ครบและเป็นตัวเลขเวลาเท่านั้น');
        }
    }
}
