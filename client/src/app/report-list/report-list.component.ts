import { Component, OnInit} from '@angular/core'
import { HttpClient } from '@angular/common/http';

declare let toastr;

@Component({
    selector: 'report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit{
    constructor(private http: HttpClient){
    }

    public lottoData:any[] = [];
    public isValid = true;

    ngOnInit(){
        this.loadLottoData();
    }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    submitLottoData(data){
        
        if(this.isNumeric(data.lottoNum) && (data.lottoNum.length === 8 || data.lottoNum.length === 18)){
            this.isValid = true;
        this.http.post<any>('http://localhost:3000/lotto', data).subscribe(result => {
            this.loadLottoData();
        })
        }
        else {
            this.isValid = false;
        }
    }

    loadLottoData(){
    this.http.get<any>('http://localhost:3000/get-lotto').subscribe(result => {
        this.lottoData = result.data;
        // this.dataSource = result.data;
    })
    }
    
    // displayedColumns: string[] = ['bookNumber', 'countNumber', 'groupNumber', 'sender', 'delete'];
    // dataSource = this.lottoData;
    
}