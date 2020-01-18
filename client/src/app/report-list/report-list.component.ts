import { Component, OnInit, Input} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit{
    // lottoForm: FormGroup;
    @Input() lottoForm: FormGroup;
    private lottoNum: FormControl;
    constructor(private http: HttpClient){
    }

    public lottoData:any[] = [];
    public isValid = true;

    ngOnInit(){
        this.lottoNum = new FormControl('', Validators.required)
        this.lottoForm = new FormGroup({
            lottoNum: this.lottoNum
          })
        this.loadLottoData();
        this.onValueChanges();
    }

    onValueChanges(): void {
        this.lottoForm.valueChanges.subscribe(data=>{
          if(data.lottoNum.length === 18){
            this.submitLottoData(data);
          }
        })
      }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    submitLottoData(data){
        console.log('data',data)
        
        if(this.isNumeric(data.lottoNum) && (data.lottoNum.length === 8 || data.lottoNum.length === 18)){
            this.isValid = true;
        this.http.post<any>('http://localhost:3000/lotto', data).subscribe(result => {
            this.loadLottoData();
        })
        }
        else {
            this.isValid = false;
        }
        this.lottoForm.reset({
            lottoNum: ''
          });
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