import { Component, OnInit, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../user/auth.service';
import { DialogService } from '../dialog/dialog.service';

@Component({
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
    // lottoForm: FormGroup;
    @Input() lottoForm: FormGroup;
    private lottoNum: FormControl;
    
    constructor(private http: HttpClient,
                private authService: AuthService,
                private dialogService: DialogService) {
    }
    public loggedinUser = this.authService.currentUser.userName;
    public lottoData: any[] = [];
    public isValid = true;
    public currentUser = { currentUser: this.loggedinUser};
    public isAvailable = true;

    ngOnInit() {
        this.lottoNum = new FormControl('', Validators.required);
        this.lottoForm = new FormGroup({
            lottoNum: this.lottoNum
          });
        this.loadLottoData();
        this.onValueChanges();
    }

    onValueChanges(): void {
        this.lottoForm.valueChanges.subscribe(data => {
          if (data.lottoNum.length === 20) {
            this.submitLottoData(data);
          }
        });
      }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    findDuplicatedLotto(data) {
        data.currentUser = this.loggedinUser;
        console.log('data', data);
        if (this.isNumeric(data.lottoNum) && (data.lottoNum.length === 8 || data.lottoNum.length === 20)) {
            this.isValid = true;
            this.http.post<any>('http://localhost:3000/find-duplicate-lotto', data).subscribe(result => {
                if (result.data.length > 0) {
                    alert('มีข้อมูลสลากหมายเลขนี้อยู่ในระบบแล้ว กรุณาเพิ่มสลากหมายเลขอื่น');
                } else {
                    this.submitLottoData(data);
                }
            });
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
        // if(this.isNumeric(data.lottoNum) && (data.lottoNum.length === 8 || data.lottoNum.length === 20)){
        //     this.isValid = true;
            this.http.post<any>('http://localhost:3000/lotto', data).subscribe(result => {
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
        this.http.post<any>('http://localhost:3000/delete-lotto', data).subscribe(result => {
            console.log('result', result);
        });
        setTimeout(() => {
            this.loadLottoData();
        },
        500);
    }

    loadLottoData() {
        this.http.post<any>('http://localhost:3000/get-lotto', this.currentUser).subscribe(result => {
            this.lottoData = result.data;
            console.log('lottoData', this.lottoData);
    });
    }


}
