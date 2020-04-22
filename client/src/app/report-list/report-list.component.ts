import { Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../user/auth.service';
import { DialogService } from '../dialog/dialog.service';
import { TimeService } from './time-service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { environment } from '../../environments/environment';
import _ from 'lodash';

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
                private dialogService: DialogService,
                private timeService: TimeService) {
    }
    public loggedinUser = this.authService.currentUser.userName;
    public lottoData: any[] = [];
    public isValid = true;
    public numberOfLotto = 0;
    public currentUser = { currentUser: this.loggedinUser};
    public isAvailable;

    displayedColumns = ['bookNumber', 'countNumber', 'groupNumber', 'delete'];
    dataSource;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    ngOnInit() {
        this.timeService.getTime();
        this.lottoNum = new FormControl('', Validators.required);
        this.lottoForm = new FormGroup({
            lottoNum: this.lottoNum
          });
        this.loadLottoData();
        this.onValueChanges();
        setTimeout(() => {
            this.isAvailable = this.timeService.isAvailable;
        },
        300);
        this.checkTime();
    }

    onValueChanges(): void {
        this.lottoForm.valueChanges.subscribe(data => {
          if (data.lottoNum.length === 16) {
            this.findDuplicatedLotto(data);
          }
        });
    }

    checkTime() {
        setInterval((d) => {this.timeService.compareTime(); } , 60000);
    }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    findDuplicatedLotto(data) {
        data.currentUser = this.loggedinUser;
        console.log('data', data);
        if (this.isNumeric(data.lottoNum) && (data.lottoNum.length === 8 || data.lottoNum.length === 16)) {
            if (this.timeService.isAvailable) {
            this.isValid = true;
            this.http.post<any>(this.serverUrl + '/find-duplicate-lotto', data).subscribe(result => {
                if (result.data.length > 0) {
                    alert('มีข้อมูลสลากหมายเลขนี้อยู่ในระบบแล้ว กรุณาเพิ่มสลากหมายเลขอื่น');
                } else {
                    this.submitLottoData(data);
                }
            });
            }
            else {
                alert('ขออภัย ขณะนี้อยู่นอกเวลาเปิดรับสลาก กรุณาติดต่อผู้ดูแลระบบ');
            }
        } else {
            this.isValid = false;
        }
        this.lottoForm.reset({
            lottoNum: ''
          });

    }

    submitLottoData(data) {
        // data.currentUser = this.loggedinUser;
        // console.log('data',data)
        // if(this.isNumeric(data.lottoNum) && (data.lottoNum.length === 8 || data.lottoNum.length === 16)){
        //     this.isValid = true;
            this.http.post<any>(this.serverUrl + '/add-lotto', data).subscribe(result => {
                this.loadLottoData();
            });
        // }
        // else {
        //     this.isValid = false;
        // }
        // this.lottoForm.reset({
        //     lottoNum: ''
        //   });
    }

    openConfirmationDialog(data) {
        this.dialogService.confirm('ลบข้อมูลสลาก', 'ยืนยันเพื่อลบข้อมูลสลากชุดนี้จากระบบ')
        .then((confirmed) => confirmed === true ? this.deleteLotto(data) : {})
        .catch(() => console.log('User dismissed the dialog'));
    }

    deleteLotto(data) {

        console.log('delete', data);
        this.http.post<any>(this.serverUrl + '/delete-lotto', data).subscribe(result => {
            console.log('result', result);
        });
        setTimeout(() => {
            this.loadLottoData();
        },
        500);
    }

    loadLottoData() {
        this.http.post<any>(this.serverUrl + '/get-lotto', this.currentUser).subscribe(result => {
            this.lottoData = result.data;
            console.log('lottoData', this.lottoData);
            this.numberOfLotto = this.lottoData.length;
            this.dataSource = new MatTableDataSource<any>(this.lottoData);
            this.dataSource.paginator = this.paginator;
    });
    }
}
