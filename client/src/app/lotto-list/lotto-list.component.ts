import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../dialog/dialog.service';

@Component({
    templateUrl: './lotto-list.component.html',
    styleUrls: ['./lotto-list.component.scss']
})
export class LottoListComponent implements OnInit {

    lottoListData: any;
    constructor(private http: HttpClient,
                private dialogService: DialogService) {
    }

    ngOnInit() {
        this.loadLottoListData();
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


}
