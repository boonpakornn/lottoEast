import { Component, OnInit, Input} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../user/auth.service';

@Component({
    selector: 'report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit{
    // lottoForm: FormGroup;
    @Input() lottoForm: FormGroup;
    private lottoNum: FormControl;
    constructor(private http: HttpClient,
                private authService: AuthService){
    }
    public loggedinUser = this.authService.currentUser.userName;
    public lottoData:any[] = [];
    public isValid = true;
    public currentUser = { currentUser: this.loggedinUser};
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
          if(data.lottoNum.length === 20){
            this.submitLottoData(data);
          }
        })
      }

    isNumeric(value) {
        return /^\d+$/.test(value);
    }

    submitLottoData(data){
        data.currentUser = this.loggedinUser;
        console.log('data',data)
        if(this.isNumeric(data.lottoNum) && (data.lottoNum.length === 8 || data.lottoNum.length === 20)){
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

    deleteLotto(data){
        console.log('delete', data)
        this.http.post<any>('http://localhost:3000/delete-lotto', data).subscribe(result => {
            console.log('result',result);
        })
        setTimeout(() => 
        {
            this.loadLottoData();
        },
        500);
    }

    loadLottoData(){
        this.http.post<any>('http://localhost:3000/get-lotto', this.currentUser).subscribe(result => {
            this.lottoData = result.data;
            console.log('lottoData', this.lottoData);
    })
    }
    
    
}