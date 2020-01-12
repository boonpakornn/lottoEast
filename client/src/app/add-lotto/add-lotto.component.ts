import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'add-lotto',
    templateUrl: './add-lotto.component.html',
    styleUrls: ['./add-lotto.component.scss']
})
export class AddLottoComponent implements OnInit {

    public lottoData:any[] = [];
    
    constructor(private http: HttpClient){
    }

    ngOnInit(){
        this.getLottoData();
    }

    submitLottoData(data){
        console.log('sent', data);
        this.http.post<any>('http://localhost:3000/lotto', data).subscribe(result => {
        console.log('result : ' + JSON.stringify(result))
        })
    }

    getLottoData(){
        console.log('received');
        this.http.get<any>('http://localhost:3000/get-lotto').subscribe(result => {
        this.lottoData = result.data;
        console.log('data : ' + JSON.stringify(result.data))
        })
    }

}