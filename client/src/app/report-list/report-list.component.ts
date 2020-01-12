import { Component, OnInit} from '@angular/core'
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit{
    constructor(private http: HttpClient){
    }

    public lottoData:any[] = [];

    ngOnInit(){
        this.loadLottoData();
    }

    submitLottoData(data){
        this.http.post<any>('http://localhost:3000/lotto', data).subscribe(result => {
            this.loadLottoData();
        })
        
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