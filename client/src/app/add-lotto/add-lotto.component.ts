import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'add-lotto',
    templateUrl: './add-lotto.component.html',
    styleUrls: ['./add-lotto.component.scss']
})
export class AddLottoComponent {
    
    constructor(private http: HttpClient){

    }

    submitLottoData(data){
        console.log('data', data);
        this.http.post<any>('http://localhost:3000/test', data).subscribe(result => {
        console.log('result : ' + JSON.stringify(result))
    })
    }
}