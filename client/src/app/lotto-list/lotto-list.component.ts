import { Component, OnInit} from '@angular/core'
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'lotto-list',
    templateUrl: './lotto-list.component.html',
    styleUrls: ['./lotto-list.component.scss']
})
export class LottoListComponent implements OnInit{

    lottoListData: any;
    constructor(private http: HttpClient){
    }

    ngOnInit(){
        this.loadLottoListData();
    }

    loadLottoListData(){
        this.http.get<any>('http://localhost:3000/get-all-lotto').subscribe(result => {
            this.lottoListData = result.data;
        })
    }

    

   
}